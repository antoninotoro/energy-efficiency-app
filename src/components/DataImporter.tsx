'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
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
              // Parsing CSV: assumiamo formato con colonne timestamp, power_kw
              const data = results.data as Array<{ timestamp?: string; power_kw?: string }>;

              if (data.length === 0) {
                throw new Error('File CSV vuoto');
              }

              // Crea profilo orario (8760 valori)
              const hourlyProfile: number[] = [];
              let maxPower = 0;
              let totalEnergy = 0;

              data.forEach((row) => {
                const power = parseFloat(row.power_kw || '0');
                if (!isNaN(power)) {
                  hourlyProfile.push(power);
                  maxPower = Math.max(maxPower, power);
                  totalEnergy += power; // kWh se il timestamp è orario
                }
              });

              // Padding se necessario (o troncamento) a 8760 ore
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
                // Tutti i file sono stati processati
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
      'application/pdf': ['.pdf'],
    },
    multiple: true,
  });

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Carica Dati Energetici</h2>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />

        {isDragActive ? (
          <p className="text-lg text-blue-600">Rilascia i file qui...</p>
        ) : (
          <div>
            <p className="text-lg text-gray-700 mb-2">
              Trascina qui i file CSV o clicca per selezionarli
            </p>
            <p className="text-sm text-gray-500">
              Supporta caricamento multiplo di file CSV con profili di consumo orari
            </p>
          </div>
        )}
      </div>

      {/* Status Upload */}
      {uploadStatus !== 'idle' && (
        <div
          className={`
          mt-4 p-4 rounded-lg flex items-center gap-3
          ${uploadStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}
        `}
        >
          {uploadStatus === 'success' ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">
                  {fileCount} file caricati con successo!
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Errore durante il caricamento</p>
                <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-2">
          <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Formato CSV richiesto:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Header: timestamp, power_kw</li>
              <li>• Valori orari o quarto-orari</li>
              <li>• L&apos;applicazione calcolerà automaticamente Pmax e consumo annuo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
