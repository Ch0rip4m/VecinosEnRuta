import { BACKEND_URL } from "../Utils/Variables";
import { React, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function ManageAccess({Component, setCheckTokens}) {
  const [tokensChecked, setTokensChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(BACKEND_URL + "/auth/verify/", { withCredentials: true });
        if (response.status === 200) {
          setTokensChecked(true);
          setCheckTokens(true);
          console.log(response.data)
        } else {
          setTokensChecked(false);
          setCheckTokens(false);
        }
      } catch (error) {
        setTokensChecked(false);
        setCheckTokens(false);
      }
    };

    checkAuth();
  }, [setCheckTokens]);

  return <>{setCheckTokens ? <Component /> : <Navigate to="/login" />}</>;
}
