'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Upload, FileText, CheckCircle, XCircle, Info } from 'lucide-react';
import { PODData } from '@/lib/types';
import { useEnergyStore } from '@/store/useEnergyStore';

export default function DataImporter() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fileCount, setFileCount] = useState(0);
  const setPODData = useEnergyStore((state) => state.setPODData);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFileCount(acceptedFiles.length);
      const allPODs: PODData[] = [];

      let filesProcessed = 0;
      acceptedFiles.forEach((file) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              const data = results.data as Array<{ timestamp?: string; power_kw?: string }>;

              if (data.length === 0) {
                throw new Error('File CSV vuoto');
              }

              const hourlyProfile: number[] = [];
              let maxPower = 0;
              let totalEnergy = 0;

              data.forEach((row) => {
                const power = parseFloat(row.power_kw || '0');
                if (!isNaN(power)) {
                  hourlyProfile.push(power);
                  maxPower = Math.max(maxPower, power);
                  totalEnergy += power;
                }
              });

              while (hourlyProfile.length < 8760) {
                hourlyProfile.push(totalEnergy / hourlyProfile.length || 0);
              }
              if (hourlyProfile.length > 8760) {
                hourlyProfile.length = 8760;
              }

              const podData: PODData = {
                podId: file.name.replace('.csv', ''),
                maxPower,
                annualConsumption: totalEnergy,
                hourlyProfile,
              };

              allPODs.push(podData);

              filesProcessed++;
              if (filesProcessed === acceptedFiles.length) {
                setPODData(allPODs);
                setUploadStatus('success');
                setErrorMessage('');
              }
            } catch (error) {
              console.error('Errore nel parsing:', error);
              setUploadStatus('error');
              setErrorMessage(
                `Errore nel file ${file.name}: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`
              );
            }
          },
          error: (error) => {
            console.error('Errore Papa Parse:', error);
            setUploadStatus('error');
            setErrorMessage(`Errore nel parsing di ${file.name}: ${error.message}`);
          },
        });
      });
    },
    [setPODData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: true,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Upload Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-6">
              <Upload className="h-10 w-10 text-blue-600 upload-icon" />
            </div>

            {isDragActive ? (
              <div>
                <p className="text-xl font-bold text-blue-700 mb-2">
                  Rilascia i file qui...
                </p>
                <p className="text-sm text-blue-600">
                  I file verranno processati automaticamente
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xl font-bold text-slate-900 mb-2">
                  Trascina qui i file CSV oppure clicca per selezionarli
                </p>
                <p className="text-slate-600 mb-4">
                  Supporto per caricamento multiplo di profili di consumo orari
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="badge badge-blue">CSV</span>
                  <span className="badge badge-gray">Multiplo</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {uploadStatus !== 'idle' && (
          <div className={uploadStatus === 'success' ? 'status-success' : 'status-error'}>
            <div className="flex items-center gap-4">
              {uploadStatus === 'success' ? (
                <>
                  <CheckCircle className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-base">
                      {fileCount} file caricati con successo!
                    </p>
                    <p className="text-sm mt-1">
                      Procedi alla configurazione delle tecnologie nel passo successivo
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-base">Errore durante il caricamento</p>
                    <p className="text-sm mt-1">{errorMessage}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Card Sidebar */}
      <div className="lg:col-span-1">
        <div className="info-card sticky top-24">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">
              Formato CSV Richiesto
            </h3>
          </div>

          <div className="space-y-4 text-sm text-slate-700">
            <div>
              <p className="font-semibold text-slate-900 mb-2">Struttura File</p>
              <div className="bg-white rounded-lg p-3 border border-blue-200 font-mono text-xs">
                <div className="text-slate-500">timestamp,power_kw</div>
                <div>2024-01-01 00:00,125.5</div>
                <div>2024-01-01 01:00,118.2</div>
                <div>2024-01-01 02:00,112.7</div>
                <div className="text-slate-400">...</div>
              </div>
            </div>

            <div>
              <p className="font-semibold text-slate-900 mb-2">Header Obbligatori</p>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><code className="text-xs bg-blue-50 px-1 py-0.5 rounded">timestamp</code> - Data e ora</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><code className="text-xs bg-blue-50 px-1 py-0.5 rounded">power_kw</code> - Potenza in kW</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-slate-900 mb-2">Caratteristiche</p>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Valori orari o quarto-orari</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Calcolo automatico Pmax</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Normalizzazione a 8760 ore</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-blue-200">
              <p className="text-xs text-slate-600">
                <strong>Nota:</strong> I file con formato errato verranno segnalati con un messaggio di errore dettagliato.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
