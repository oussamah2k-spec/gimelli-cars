import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { app } from '../firebase/auth';

const db = getFirestore(app);

export function useFirestore(collectionName, documentId) {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!documentId) {
      setDocument(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadDocument() {
      try {
        setLoading(true);
        setError(null);

        const snapshot = await getDoc(doc(db, collectionName, documentId));

        if (!isMounted) {
          return;
        }

        if (!snapshot.exists()) {
          setDocument(null);
          return;
        }

        setDocument({ id: snapshot.id, ...snapshot.data() });
      } catch (loadError) {
        if (isMounted) {
          setError(loadError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDocument();

    return () => {
      isMounted = false;
    };
  }, [collectionName, documentId]);

  return { document, error, loading };
}