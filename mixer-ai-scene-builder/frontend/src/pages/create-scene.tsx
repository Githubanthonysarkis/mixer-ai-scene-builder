import React, { useState } from 'react';
import styles from '../styles/CreateScene.module.css';

export default function CreateScene() {
  // ✅ Brands & Mixers
  const brands = ['Music Tribe', 'Mackie', 'Midas', 'Presonus', 'QSC', 'Yamaha'];

  const mixersByBrand: Record<string, string[]> = {
    'Music Tribe': ['Behringer X32', 'Midas M32', 'Behringer WING', 'XR18', 'MR18'],
    'Mackie': ['DL32R', 'DL1608'],
    'Midas': ['PRO1', 'PRO2', 'PRO X'],
    'Presonus': ['StudioLive 32SC', 'StudioLive 16R'],
    'QSC': ['TouchMix-8', 'TouchMix-16', 'TouchMix-30'],
    'Yamaha': ['TF1', 'TF3', 'QL5', 'CL5'],
  };

  // ✅ State Hooks
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedMixer, setSelectedMixer] = useState<string | null>(null);
  const [scenePrompt, setScenePrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<string | null>(null);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Mixer AI Scene Builder</h1>
      <p className={styles.subtitle}>Select a mixer brand and model to start building your scene.</p>

      <div className={styles.layout}>
        {/* Left Panel - Brands */}
        <div className={styles.brandPanel}>
          <ul className={styles.brandList}>
            {brands.map((brand) => (
              <li key={brand}>
                <button
                  className={`${styles.brandButton} ${selectedBrand === brand ? styles.active : ''}`}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setSelectedMixer(null); // Reset mixer if switching brand
                  }}
                >
                  {brand}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel - Mixers + Scene Input */}
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
                        const res = await fetch('/api/scene/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            brand: selectedBrand,
                            mixer: selectedMixer,
                            prompt: scenePrompt,
                          }),
                        });

                        const data = await res.json();
                        if (res.ok) {
                          setGenerationResult(data.message || 'Scene generated successfully!');
                        } else {
                          setGenerationResult(data.error || 'Something went wrong.');
                        }
                      } catch (err) {
                        console.error(err);
                        setGenerationResult('Error: Unable to connect to backend.');
                      } finally {
                        setIsGenerating(false);
                      }
                    }}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Scene'}
                  </button>

                  {generationResult && (
                    <p className={`${styles.resultMessage} ${generationResult.startsWith('Error') ? styles.error : styles.success}`}>
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
