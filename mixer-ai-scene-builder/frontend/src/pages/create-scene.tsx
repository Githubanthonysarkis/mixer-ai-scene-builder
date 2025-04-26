import React, { useState } from 'react';
import styles from '../styles/CreateScene.module.css';

export default function CreateScene() {
  // 🎛️ Available brands
  const brands = ['Music Tribe', 'Mackie', 'Midas', 'Presonus', 'QSC', 'Yamaha'];

  // 🎛️ Mixer models per brand
  const mixersByBrand: Record<string, string[]> = {
    'Music Tribe': ['Behringer X32', 'Midas M32', 'Behringer WING', 'XR18', 'MR18'],
    'Mackie': ['DL32R', 'DL1608'],
    'Midas': ['PRO1', 'PRO2', 'PRO X'],
    'Presonus': ['StudioLive 32SC', 'StudioLive 16R'],
    'QSC': ['TouchMix-8', 'TouchMix-16', 'TouchMix-30'],
    'Yamaha': ['TF1', 'TF3', 'QL5', 'CL5'],
  };

  const defaultBrand='Music Tribe';
  const defaultMixer='Behringer X32';

  // 📦 State management
  const [selectedBrand, setSelectedBrand] = useState<string>(defaultBrand);
  const [selectedMixer, setSelectedMixer] = useState<string>(defaultMixer);
  const [scenePrompt, setScenePrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<string | null>(null);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Mixer AI Scene Builder</h1>
      <p className={styles.subtitle}>Select a mixer brand and model to start building your scene.</p>

      <div className={styles.layout}>
        {/* Brand selector */}
        <div className={styles.brandPanel}>
          <ul className={styles.brandList}>
            {brands.map((brand) => (
              <li key={brand}>
                <button
                  className={`${styles.brandButton} ${selectedBrand === brand ? styles.active : ''}`}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setSelectedMixer(mixersByBrand[brand][0]);
                  }}
                >
                  {brand}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Mixer selector + scene config */}
        <div className={styles.mixerPanel}>
          {selectedBrand ? (
            <>
              <h2>{selectedBrand} Mixers</h2>
              <div className={styles.mixerList}>
                {mixersByBrand[selectedBrand]?.map((mixer) => (
                  <div
                    key={mixer}
                    className={`${styles.mixerCard} ${selectedMixer === mixer ? styles.selected : ''}`}
                    onClick={() => setSelectedMixer(mixer)}
                  >
                    <h3>{mixer}</h3>
                    <p>{selectedMixer === mixer ? 'Selected!' : 'Click to configure this model'}</p>
                  </div>
                ))}
              </div>

              {selectedMixer && (
                <div className={styles.sceneInput}>
                  <h3>Describe your desired scene setup:</h3>
                  <textarea
                    value={scenePrompt}
                    onChange={(e) => setScenePrompt(e.target.value)}
                    className={styles.textarea}
                    placeholder="e.g. Drums on 1-8, reverb on vocals, bus 3 for monitors..."
                    rows={5}
                  />

                  {/* ✅ Downloadable scene file trigger */}
                  <button
                    className={styles.generateButton}
                    disabled={isGenerating}
                    onClick={async () => {
                      if (!selectedBrand || !selectedMixer || !scenePrompt) {
                        return alert('Please complete all fields.');
                      }

                      setIsGenerating(true);
                      setGenerationResult(null);

                      try {
                        const API_BASE = process.env.NEXT_PUBLIC_API_URL;
                        const res = await fetch(`${API_BASE}/scene/generate`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            brand: selectedBrand,
                            mixer: selectedMixer,
                            prompt: scenePrompt,
                          }),
                        });

                        if (!res.ok) {
                          const errorData = await res.json();
                          setGenerationResult(errorData.error || 'Scene generation failed.');
                          return;
                        }

                        const blob = await res.blob();
                        const fileName = `${selectedMixer.replace(/\s+/g, '_')}_scene.json`;

                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = fileName;
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        window.URL.revokeObjectURL(url);

                        setGenerationResult(`✅ File "${fileName}" downloaded successfully.`);
                      } catch (err) {
                        console.error(err);
                        setGenerationResult('Error: Unable to download file.');
                      } finally {
                        setIsGenerating(false);
                      }
                    }}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Scene'}
                  </button>

                  {/* Message below button */}
                  {generationResult && (
                    <p
                      className={`${styles.resultMessage} ${
                        generationResult.startsWith('Error') ? styles.error : styles.success
                      }`}
                    >
                      {generationResult}
                    </p>
                  )}
                </div>
              )}
            </>
          ) : (
            <p>Please select a brand from the left.</p>
          )}
        </div>
      </div>
    </main>
  );
}
