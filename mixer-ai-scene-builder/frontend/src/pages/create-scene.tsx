import React, { useState } from 'react';
import styles from '../styles/CreateScene.module.css';
import { apiFetch } from '@/utils/api';

export default function CreateScene() {
  // 🎛 Supported brands and mixers
  const brands = ['Music Tribe', 'Mackie', 'Midas', 'Presonus', 'QSC', 'Yamaha'];

  const mixersByBrand: Record<string, string[]> = {
    'Music Tribe': ['Behringer X32', 'Midas M32', 'Behringer WING', 'XR18', 'MR18'],
    Mackie: ['DL32R', 'DL1608'],
    Midas: ['PRO1', 'PRO2', 'PRO X'],
    Presonus: ['StudioLive 32SC', 'StudioLive 16R'],
    QSC: ['TouchMix-8', 'TouchMix-16', 'TouchMix-30'],
    Yamaha: ['TF1', 'TF3', 'QL5', 'CL5'],
  };

  // 🎚 Defaults for quick demo
  const defaultBrand = 'Music Tribe';
  const defaultMixer = 'Behringer X32';

  // 🎛 UI state
  const [selectedBrand, setSelectedBrand] = useState(defaultBrand);
  const [selectedMixer, setSelectedMixer] = useState(defaultMixer);
  const [scenePrompt, setScenePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<string | null>(null);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Mixer AI Scene Builder</h1>
      <p className={styles.subtitle}>Select a mixer brand and model to start building your scene.</p>

      <div className={styles.layout}>
        {/* 🧱 Vertical brand selector */}
        <div className={styles.brandPanel}>
          <ul className={styles.brandList}>
            {brands.map((brand) => (
              <li key={brand}>
                <button
                  className={`${styles.brandButton} ${selectedBrand === brand ? styles.active : ''}`}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setSelectedMixer(mixersByBrand[brand][0]); // Reset mixer selection
                  }}
                >
                  {brand}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 🎛 Mixer list and input */}
        <div className={styles.mixerPanel}>
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

          {/* 🧠 Scene Input & Button Area */}
          <div className={styles.sceneInput}>
            <h3>Describe your desired scene setup:</h3>
            <textarea
              value={scenePrompt}
              onChange={(e) => setScenePrompt(e.target.value)}
              className={styles.textarea}
              rows={5}
              placeholder="e.g. Drums on 1-8, reverb on vocals, monitors to bus 3..."
            />

            {/* ⚙️ Generate and Download Scene */}
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
                  const blob = await apiFetch('scene/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      brand: selectedBrand,
                      mixer: selectedMixer,
                      prompt: scenePrompt,
                    }),
                  });

                  // 🧾 Download file
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
                } catch (err: any) {
                  console.error(err);
                  setGenerationResult('Error: Unable to download file.');
                } finally {
                  setIsGenerating(false);
                }
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate Scene'}
            </button>

            {/* 📌 Result message */}
            {generationResult && (
              <p
                className={`${styles.resultMessage} ${
                  generationResult.startsWith('Error') ? styles.error : styles.success
                }`}
              >
                {generationResult}
              </p>
            )}

            {/* 💾 Save Scene for Logged-In Users */}
            <button
              className={styles.saveButton}
              onClick={async () => {
                const token = localStorage.getItem('token');
                if (!token) return alert('You must be logged in to save a scene.');
                const sceneName = prompt('Enter a name for this scene:');
                if (!sceneName) return;

                try {
                  await apiFetch('scene/save-scene', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                      brand: selectedBrand,
                      mixer: selectedMixer,
                      prompt: scenePrompt,
                      sceneName,
                    }),
                  });
                  alert('✅ Scene saved successfully!');
                } catch (err: any) {
                  alert(`❌ Failed to save: ${err.message}`);
                }
              }}
            >
              Save Scene
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
