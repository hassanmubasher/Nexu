import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { X, Check, FileText, Download, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface DocumentChamberProps {
  document: {
    id: number;
    name: string;
    size: string;
    lastModified: string;
    status?: 'Draft' | 'In Review' | 'Signed';
  };
  onClose: () => void;
  onSign: (docId: number, signatureUrl: string) => void;
}

export const DocumentChamber: React.FC<DocumentChamberProps> = ({ document, onClose, onSign }) => {
  const [status, setStatus] = useState<'Draft' | 'In Review' | 'Signed'>(document.status || 'In Review');
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);

  if (!document) return null;

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const saveSignature = () => {
    if (sigCanvas.current?.isEmpty()) {
      alert("Please provide a signature first.");
      return;
    }
    const dataURL = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
    if (dataURL) {
      setSignatureData(dataURL);
      setStatus('Signed');
      onSign(document.id, dataURL);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white border border-gray-200 rounded-lg overflow-hidden animate-fade-in shadow-sm relative z-10">
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg text-primary-700">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">{document.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm text-gray-500">{document.size} • Last Modified: {document.lastModified}</span>
              
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                status === 'Signed' ? 'bg-success-100 text-success-700' :
                status === 'In Review' ? 'bg-warning-100 text-warning-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close Chamber">
             <X size={20} />
           </Button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left: Document Preview Mock */}
        <div className="flex-1 bg-gray-100 p-6 overflow-y-auto flex justify-center border-r border-gray-200">
          <div className="bg-white w-full max-w-3xl min-h-[800px] shadow-sm border border-gray-200 p-12 text-gray-800">
            {/* Mock Document Content */}
            <div className="border-b-2 border-gray-900 pb-6 mb-8">
              <h1 className="text-3xl font-serif text-center uppercase tracking-wider">Confidential Agreement</h1>
              <p className="text-center text-gray-500 mt-2 font-serif">Document Ref: {document.id}-NXU</p>
            </div>
            
            <div className="space-y-6 font-serif leading-relaxed text-justify">
              <p>This NON-DISCLOSURE AGREEMENT (the "Agreement") is entered into on this {new Date().toLocaleDateString()}, by and between Business Nexus LLC ("Disclosing Party") and the undersigned individual/entity ("Receiving Party").</p>
              
              <h3 className="font-bold text-lg mt-8">1. Confidential Information</h3>
              <p>The Receiving Party acknowledges that in the course of discussing potential business relationships, the Disclosing Party may disclose certain confidential, proprietary, and trade secret information ("Confidential Information").</p>
              
              <h3 className="font-bold text-lg mt-8">2. Obligations</h3>
              <p>The Receiving Party agrees to maintain the Confidential Information in strict confidence and shall not disclose it to any third party without the express written consent of the Disclosing Party.</p>
              
              <h3 className="font-bold text-lg mt-8">3. Term</h3>
              <p>This Agreement shall remain in effect for a period of two (2) years from the date of execution.</p>
            </div>

            {/* Signature Area on Document */}
            <div className="mt-20 pt-8 border-t border-gray-200 flex justify-between">
               <div className="w-1/2 pr-8">
                 <p className="font-medium mb-4">Disclosing Party:</p>
                 <div className="h-16 border-b border-gray-400 flex items-end pb-2">
                   <span className="font-[cursive] italic text-xl text-gray-600">Business Nexus Admin</span>
                 </div>
                 <p className="text-sm text-gray-500 mt-2">Date: {document.lastModified}</p>
               </div>
               <div className="w-1/2 pl-8">
                 <p className="font-medium mb-4">Receiving Party:</p>
                 <div className="h-16 border-b border-gray-400 flex items-end pb-2 relative">
                   {signatureData ? (
                     <img src={signatureData} alt="Signature" className="absolute bottom-0 h-16 object-contain pointer-events-none" />
                   ) : (
                     <span className="text-gray-300 italic">Signature pending...</span>
                   )}
                 </div>
                 <p className="text-sm text-gray-500 mt-2">Date: {status === 'Signed' ? new Date().toLocaleDateString() : '_____'}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Signature Tools & Actions */}
        <div className="w-full lg:w-96 bg-white flex flex-col overflow-y-auto">
          <div className="p-6 flex-1 space-y-8">
            
            {status !== 'Signed' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary-700 mb-2">
                  <ShieldCheck size={20} />
                  <h3 className="font-medium">E-Signature Required</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Please review the document carefully. Draw your signature below to legally bind this agreement.
                </p>
                
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <SignatureCanvas 
                    ref={sigCanvas} 
                    penColor="black"
                    canvasProps={{ className: 'w-full h-48 cursor-crosshair touch-none' }} 
                  />
                </div>
                
                <div className="flex justify-between items-center px-1">
                  <button onClick={clearSignature} className="text-sm text-gray-500 hover:text-gray-700 underline">
                    Clear Signature
                  </button>
                </div>
                
                <Button fullWidth onClick={saveSignature} leftIcon={<Check size={18} />}>
                  Sign Document
                </Button>
              </div>
            ) : (
              <div className="bg-success-50 rounded-xl p-6 border border-success-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-success-100 text-success-600 rounded-full flex items-center justify-center mb-4">
                  <Check size={32} />
                </div>
                <h3 className="text-lg font-semibold text-success-900 mb-2">Document Signed</h3>
                <p className="text-sm text-success-700 mb-6">
                  This document has been successfully signed and legally bound.
                </p>
                <div className="flex gap-3 w-full">
                  <Button fullWidth variant="outline" leftIcon={<Download size={18} />}>
                    Download
                  </Button>
                </div>
              </div>
            )}
            
            <div className="border-t border-gray-100 pt-6 space-y-4">
               <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Document History</h4>
               <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active text-sm">
                    <div className="flex items-center justify-center w-4 h-4 rounded-full border border-white bg-primary-500 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow" />
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded border border-gray-100 shadow-sm ml-4 md:ml-0">
                      <div className="font-medium text-gray-900">Document Generated</div>
                      <div className="text-gray-500 text-xs mt-1">{document.lastModified}</div>
                    </div>
                  </div>
                  {status === 'Signed' && (
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active text-sm">
                      <div className="flex items-center justify-center w-4 h-4 rounded-full border border-white bg-success-500 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow" />
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded border border-gray-100 shadow-sm mr-4 md:mr-0">
                        <div className="font-medium text-success-700">Signed</div>
                        <div className="text-gray-500 text-xs mt-1">Just now</div>
                      </div>
                    </div>
                  )}
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
