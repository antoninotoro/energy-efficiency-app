'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Upload, FileText, CheckCircle, XCircle, Sparkles, Database } from 'lucide-react';
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
      'application/pdf': ['.pdf'],
    },
    multiple: true,
  });

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 blur-lg opacity-50 rounded-full" />
          <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl">
            <Database className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Carica Dati Energetici</h2>
          <p className="text-slate-400 text-sm">Upload profili di consumo POD</p>
        </div>
      </motion.div>

      {/* Dropzone with Modern Design */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 overflow-hidden group animate-fadeIn
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-500/10 scale-105'
              : 'border-slate-600 bg-slate-800/30 hover:border-blue-400 hover:bg-slate-800/50'
          }
        `}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <input {...getInputProps()} />

        {/* Icon with animation */}
        <motion.div
          animate={isDragActive ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:shadow-blue-500/50 transition-shadow duration-300">
            <Upload className="h-10 w-10 text-white" />
          </div>
        </motion.div>

        {isDragActive ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="text-xl font-semibold text-blue-400">Rilascia i file qui...</p>
            <Sparkles className="h-6 w-6 text-blue-400 mx-auto animate-pulse" />
          </motion.div>
        ) : (
          <div className="space-y-3 relative z-10">
            <p className="text-lg font-semibold text-slate-200">
              Trascina qui i file CSV o clicca per selezionarli
            </p>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Supporta caricamento multiplo di file CSV con profili di consumo orari. Formati
              accettati: CSV, PDF
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                CSV
              </div>
              <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-medium">
                PDF
              </div>
            </div>
          </div>
        )}

        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-10 pointer-events-none" />
      </div>

      {/* Status Upload with Animations */}
      {uploadStatus !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className={`
            p-5 rounded-2xl flex items-center gap-4 border
            ${
              uploadStatus === 'success'
                ? 'bg-green-500/10 border-green-500/30 neon-glow-green'
                : 'bg-red-500/10 border-red-500/30'
            }
          `}
        >
          {uploadStatus === 'success' ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl"
              >
                <CheckCircle className="h-6 w-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <p className="text-green-400 font-semibold text-lg">
                  {fileCount} file caricati con successo!
                </p>
                <p className="text-green-300/70 text-sm mt-1">
                  Procedi alla configurazione delle tecnologie
                </p>
              </div>
              <Sparkles className="h-5 w-5 text-green-400 animate-pulse" />
            </>
          ) : (
            <>
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-red-500 to-pink-600 p-2 rounded-xl"
              >
                <XCircle className="h-6 w-6 text-white" />
              </motion.div>
              <div className="flex-1">
                <p className="text-red-400 font-semibold">Errore durante il caricamento</p>
                <p className="text-red-300/70 text-sm mt-1">{errorMessage}</p>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Info Box with Modern Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6 rounded-2xl border border-blue-500/20"
      >
        <div className="flex gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-xl h-fit">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              Formato CSV richiesto
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                Importante
              </span>
            </h3>
            <ul className="text-sm text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                <span>
                  <strong className="text-white">Header:</strong> timestamp, power_kw
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                <span>Valori orari o quarto-orari</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                <span>L&apos;applicazione calcolerà automaticamente Pmax e consumo annuo</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
