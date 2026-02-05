'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Upload, FileText, CheckCircle, XCircle, Database } from 'lucide-react';
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
    <div className="space-y-8">
      {/* Header */}
      <div className="section-header">
        <div className="icon-box bg-gradient-blue">
          <Database className="h-7 w-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Carica Dati Energetici</h2>
          <p className="text-gray-600">Upload profili di consumo POD (file CSV)</p>
        </div>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-4 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={`
            icon-box ${isDragActive ? 'bg-gradient-blue' : 'bg-gray-200'}
            transition-all duration-200
          `}>
            <Upload className={`h-8 w-8 ${isDragActive ? 'text-white' : 'text-gray-600'}`} />
          </div>

          {isDragActive ? (
            <div>
              <p className="text-xl font-bold text-blue-600 mb-2">Rilascia i file qui...</p>
            </div>
          ) : (
            <div>
              <p className="text-xl font-bold text-gray-900 mb-2">
                Trascina qui i file CSV o clicca per selezionarli
              </p>
              <p className="text-gray-600">
                Supporta caricamento multiplo di file CSV con profili di consumo orari
              </p>
              <div className="mt-4 inline-block">
                <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm">
                  Formato accettato: CSV
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Upload */}
      {uploadStatus !== 'idle' && (
        <div className={uploadStatus === 'success' ? 'status-success' : 'status-error'}>
          <div className="flex items-center gap-4">
            {uploadStatus === 'success' ? (
              <>
                <CheckCircle className="h-8 w-8 flex-shrink-0" />
                <div>
                  <p className="font-bold text-lg">
                    {fileCount} file caricati con successo!
                  </p>
                  <p className="mt-1">
                    Procedi alla configurazione delle tecnologie nella sezione successiva
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-8 w-8 flex-shrink-0" />
                <div>
                  <p className="font-bold text-lg">Errore durante il caricamento</p>
                  <p className="mt-1">{errorMessage}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="form-section">
        <div className="flex items-start gap-4">
          <FileText className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-3">
              Formato CSV Richiesto
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">•</span>
                <span><strong>Header:</strong> timestamp, power_kw</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">•</span>
                <span>Valori orari o quarto-orari del consumo elettrico</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">•</span>
                <span>L'applicazione calcolerà automaticamente Pmax e consumo annuo</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
