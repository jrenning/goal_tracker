import { useEffect, useState } from "react";

// checks to make sure the site is loaded before trying to render icons
// helps to stop an annoying console error
// found here https://stackoverflow.com/questions/55271855/react-material-ui-ssr-warning-prop-d-did-not-match-server-m-0-0-h-24-v-2
export const useLoaded = () => {
  const [loaded, setLoaded] = useState<boolean>();
  useEffect(() => setLoaded(true), []);
  return loaded;
};
