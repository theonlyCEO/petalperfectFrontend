import { createContext, useContext, useState, useEffect } from 'react';

// Create the IpContext
const IpContext = createContext();

// Export the IpProvider
export function IpProvider({ children }) {
  const [ip, setIp] = useState(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    let currentIp = url.searchParams.get("ip");

    if (!currentIp) {
      currentIp = "98.89.187.56:3000"; // your EC2 public IP
      url.searchParams.set("ip", currentIp);
      window.history.replaceState({}, "", url);
    }

    setIp(currentIp);

    const handlePopState = () => {
      const newUrl = new URL(window.location.href);
      setIp(newUrl.searchParams.get("ip"));
    };
    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const updateIp = (newIp) => {
    const url = new URL(window.location.href);
    url.searchParams.set("ip", newIp);
    window.history.pushState({}, "", url);
    setIp(newIp);
  };

  // Function to fetch data from your EC2 backend
  const callBackend = async (endpoint = "/") => {
    if (!ip) return null;
    try {
      const response = await fetch(`http://${ip}:3000${endpoint}`); // change port if needed
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error connecting to EC2:", err);
      return null;
    }
  };

  return (
    <IpContext.Provider value={{ ip, updateIp, callBackend }}>
      {children}
    </IpContext.Provider>
  );
}

// Export the useIp hook
export const useIp = () => {
  const context = useContext(IpContext);
  if (!context) {
    throw new Error('useIp must be used within an IpProvider');
  }
  return context;
};