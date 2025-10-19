import { useEffect, useState } from "react";
import api from "../api";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/authentication", { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data); // { username, is_admin, ... }
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
