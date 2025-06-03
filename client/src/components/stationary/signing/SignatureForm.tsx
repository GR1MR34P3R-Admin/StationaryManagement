import * as React from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StationaryIssue } from "@/lib/types";
import { CheckCircle2, RefreshCw, Edit, AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SignatureFormProps {
  issue: StationaryIssue;
  onSignatureComplete: (issueId: string, signatureData: string) => void;
}

export function SignatureForm({ issue, onSignatureComplete }: SignatureFormProps) {
  const sigCanvas = React.useRef<SignatureCanvas>(null);
  const [isSigned, setIsSigned] = React.useState(false);
  const [previewMode, setPreviewMode] = React.useState(false);
  const [signatureData, setSignatureData] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  
  const clearSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsSigned(false);
      setError(null);
    }
  };
  
  const checkSignature = () => {
    if (sigCanvas.current) {
      const isEmpty = sigCanvas.current.isEmpty();
      setIsSigned(!isEmpty);
      if (!isEmpty) {
        setError(null);
      }
    }
  };
  
  const handlePreview = () => {
    if (sigCanvas.current) {
      if (sigCanvas.current.isEmpty()) {
        setError("Please sign before previewing");
        return;
      }
      
      const data = sigCanvas.current.toDataURL('image/png');
      setSignatureData(data);
      setPreviewMode(true);
      setError(null);
    }
  };
  
  const handleEdit = () => {
    setPreviewMode(false);
    setSignatureData(null);
  };
  
  const handleConfirm = () => {
    if (previewMode && signatureData) {
      onSignatureComplete(issue.id, signatureData);
      return;
    }
    
    if (sigCanvas.current) {
      if (sigCanvas.current.isEmpty()) {
        setError("Please sign before confirming");
        return;
      }
      
      const data = sigCanvas.current.toDataURL('image/png');
      setSignatureData(data);
      setPreviewMode(true);
      setError(null);
    }
  };
  
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!previewMode ? (
        <div className="space-y-2">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-2 bg-white">
            <p className="text-xs text-muted-foreground mb-1 flex items-center">
              <Edit className="h-3 w-3 mr-1" />
              Sign below using mouse or touch
            </p>
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                className: "w-full h-[200px] border border-input bg-white",
                style: { cursor: 'crosshair' }
              }}
              onEnd={checkSignature}
              penColor="black"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={clearSignature} size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Clear
            </Button>
            
            <Button 
              onClick={handlePreview}
              disabled={!isSigned}
              size="sm"
              variant="outline"
            >
              Preview Signature
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="border-2 border-dashed border-green-300 rounded-md p-4 bg-green-50">
            <p className="text-xs text-green-700 mb-2 flex items-center font-medium">
              <Check className="h-4 w-4 mr-1" />
              Signature Preview
            </p>
            {signatureData && (
              <div className="bg-white p-2 rounded border">
                <img 
                  src={signatureData} 
                  alt="Signature preview" 
                  className="max-h-[200px] mx-auto"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleEdit} size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Signature
            </Button>
          </div>
        </div>
      )}
      
      <Card className="p-4 bg-muted/20">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium">
            I, <span className="font-bold">{issue.employeeName}</span>, acknowledge receipt of the following items:
          </p>
          
          <div className="flex items-center text-sm">
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {issue.items.map((item, index) => (
                <li key={index}>
                  <span className="font-medium">{item.itemName}</span>: {item.quantity} {item.quantity > 1 ? 'units' : 'unit'}
                </li>
              ))}
            </ul>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            By signing above, I confirm that I have received the items listed and accept responsibility for their care and proper use according to company policy.
          </p>
        </div>
      </Card>
      
      <div className="pt-2">
        <Button 
          onClick={handleConfirm} 
          disabled={!isSigned && !previewMode}
          className="w-full"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {previewMode ? "Confirm and Submit" : "Confirm Receipt"}
        </Button>
      </div>
    </div>
  );
}
