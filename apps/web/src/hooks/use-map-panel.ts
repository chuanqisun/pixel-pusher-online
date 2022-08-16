import type { PrebuiltMap } from "assets/src/interface";
import { useCallback } from "preact/hooks";

export interface UseMapPanelProps {
  sendToMain: (message: any) => any;
}
export function useMapPanel({ sendToMain }: UseMapPanelProps) {
  const handleSelectMap = useCallback((key: string, selectedMap: PrebuiltMap) => {
    function dataUriToBytes(uri: string) {
      const byteString = window.atob(uri.split(",")[1]);
      const bytes = new Uint8Array(new ArrayBuffer(byteString.length));

      for (let i = 0; i < byteString.length; i++) {
        bytes[i] = byteString.charCodeAt(i);
      }

      return bytes;
    }

    sendToMain({
      map: {
        key,
        name: selectedMap.name,
        imageBytes: dataUriToBytes(selectedMap.imgUrl),
        rows: selectedMap.rows,
        cols: selectedMap.cols,
        spawnTiles: selectedMap.spawnTiles,
      },
    });
  }, []);

  return { handleSelectMap };
}
