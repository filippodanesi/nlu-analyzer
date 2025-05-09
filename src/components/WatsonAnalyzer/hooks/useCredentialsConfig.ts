
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

// Estratto delle variabili d'ambiente per Watson
export const SECRETS = {
  apiKey: process.env.NATURAL_LANGUAGE_UNDERSTANDING_APIKEY || 
          process.env.NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY || "",
  url: process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL || "",
  authType: process.env.NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE || "iam",
  // Estrai la regione dall'URL se disponibile
  region: (() => {
    const url = process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL || "";
    // Prova a estrarre la regione dall'URL (formato: https://api.{region}.natural-language-understanding...)
    const match = url.match(/api\.(.*?)\.natural-language-understanding/);
    return match ? match[1] : "eu-de";
  })(),
  instanceId: (() => {
    const url = process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL || "";
    // Prova a estrarre l'ID istanza dall'URL (formato: .../instances/{instanceId}/...)
    const match = url.match(/instances\/(.*?)\//);
    return match ? match[1] : "";
  })(),
  credentialsFileExists: false // Default a false, controlleremo nell'useEffect
};

export const useCredentialsConfig = () => {
  // Verifica se sono presenti variabili d'ambiente Watson
  const hasWatsonEnvVars = !!(
    process.env.NATURAL_LANGUAGE_UNDERSTANDING_APIKEY || 
    process.env.NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY ||
    process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL
  );
  
  // Stato per l'utilizzo dei segreti - verifica se sono presenti variabili d'ambiente
  const [useSecrets, setUseSecrets] = useState(hasWatsonEnvVars);
  
  // Configurazione dell'API
  const [apiKey, setApiKey] = useState("");
  const [url, setUrl] = useState("");
  const [region, setRegion] = useState("eu-de"); // Default a eu-de
  const [instanceId, setInstanceId] = useState("");
  
  // Stato del file credenziali
  const [credentialsFileExists, setCredentialsFileExists] = useState(false);

  // Verifica l'esistenza del file ibm-credentials.env
  useEffect(() => {
    const checkCredentialsFile = async () => {
      try {
        // Proviamo a recuperare il file per verificare se esiste
        const response = await fetch('/ibm-credentials.env', { method: 'HEAD' });
        if (response.ok) {
          setCredentialsFileExists(true);
          setUseSecrets(true); // Se il file esiste, abilita i segreti di default
          toast({
            title: "File credenziali IBM trovato",
            description: "Il file ibm-credentials.env è stato rilevato e verrà utilizzato per l'autenticazione.",
          });
        }
      } catch (error) {
        console.log('File credenziali IBM non trovato');
      }
    };
    
    checkCredentialsFile();
  }, []);

  // Imposta lo stato iniziale in base alle variabili d'ambiente
  useEffect(() => {
    if (useSecrets && hasWatsonEnvVars) {
      setApiKey(SECRETS.apiKey);
      setUrl(SECRETS.url);
      setRegion(SECRETS.region);
      setInstanceId(SECRETS.instanceId);
    }
  }, [useSecrets, hasWatsonEnvVars]);

  // Gestione toggle dei segreti
  const handleUseSecretsChange = (value: boolean) => {
    setUseSecrets(value);
    
    // Se abilitato, usa credenziali dai segreti
    if (value && hasWatsonEnvVars) {
      setApiKey(SECRETS.apiKey);
      setUrl(SECRETS.url);
      setRegion(SECRETS.region);
      setInstanceId(SECRETS.instanceId);
    } else {
      // Se disabilitato, reimposta i campi
      setApiKey("");
      setUrl("");
      setRegion("eu-de");
      setInstanceId("");
    }
  };
  
  // Restituisci valori che verranno utilizzati dal componente
  return {
    // Stato segreti
    useSecrets,
    setUseSecrets: handleUseSecretsChange,
    credentialsFileExists,
    hasWatsonEnvVars,
    
    // Configurazione API
    apiKey,
    setApiKey,
    url,
    setUrl,
    region,
    setRegion,
    instanceId,
    setInstanceId,
    
    // Funzioni di utilità
    getCurrentApiKey: () => useSecrets ? SECRETS.apiKey : apiKey,
    getCurrentUrl: () => {
      if (useSecrets) return SECRETS.url;
      return region !== "custom" ? 
        `https://api.${region}.natural-language-understanding.watson.cloud.ibm.com/instances/${instanceId}/v1/analyze?version=2022-04-07` : 
        url;
    },
    getAuthType: () => SECRETS.authType || "iam"
  };
};
