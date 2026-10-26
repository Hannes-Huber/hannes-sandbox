import { useContext } from "react";
import WordPressContext from "./WordPressContext";

export default function useWordPressContent() {
  const content = useContext(WordPressContext);
  if (!content) throw new Error("useWordPressContent must be used inside WordPressProvider");
  return content;
}
