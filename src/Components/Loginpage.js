import React from 'react';


export default function LoginPage() {
  const loginWithGoogle = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  }

  return (
    <>
      
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">Login with Google</h5>
                <button className="btn btn-danger btn-block" onClick={loginWithGoogle}>
                  <i className="fab fa-google mr-2"></i> Sign in with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
