import React, { useEffect } from "react";
import useModal from "~/hooks/useModal";

function login() {
  const { loginModal } = useModal();
  useEffect(() => {
    loginModal();
  }, []);

  return <div></div>;
}

export default login;
