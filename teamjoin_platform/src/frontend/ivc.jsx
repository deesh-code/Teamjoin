import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, doc, setDoc } from 'firebase/firestore';

const IVC = () => {
  // State variables for Firebase and user data
  const [firebaseApp, setFirebaseApp] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Initialize Firebase and handle authentication
  useEffect(() => {
    // Check for global variables provided by the environment
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    try {
      // Initialize Firebase app
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);
      
      setFirebaseApp(app);
      setDb(firestore);
      setAuth(firebaseAuth);

      // Sign in with custom token or anonymously
      const signIn = async () => {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(firebaseAuth, initialAuthToken);
          } else {
            await signInAnonymously(firebaseAuth);
          }
          console.log("Firebase auth successful.");
        } catch (error) {
          console.error("Firebase authentication error:", error);
        }
      };

      // Listen for authentication state changes
      const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
        if (user) {
          setUserId(user.uid);
        } else {
          setUserId(null);
        }
        setIsAuthReady(true);
      });

      signIn();

      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase initialization error:", e);
      setIsAuthReady(true);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Idea Verification Certificate (IVC)</h1>
        <p className="text-gray-600">Verify your identity and join the verified community</p>
      </div>

      {/* IVC Card */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <form>
          {/* Upload Photo */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Upload Photo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500 hover:border-purple-600 transition-colors duration-200 cursor-pointer">
              <svg className="mx-auto w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p>Drag & drop or click to upload (PNG/JPG)</p>
            </div>
            <p className="text-sm text-gray-400 mt-2">Max size 5MB. Clear face photo recommended.</p>
          </div>
          
          {/* Form Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Full Real Name</label>
              <input type="text" placeholder="Enter your full legal name" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-600" />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input type="email" placeholder="you@example.com" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-600" />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
            <input type="tel" placeholder="+1 555 000 1234" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-600" />
          </div>

          {/* Select TeamBox */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Select your TeamBox</label>
            <div className="relative">
              <select className="appearance-none w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white">
                <option>Choose from your TeamBoxes</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707 4-4a1 1 0 011.414 0l1.293-1.293a.5.5 0 00-.707-.707L12 8.793l-4-4a1 1 0 00-1.414 0z"/></svg>
              </div>
            </div>
            
            {/* TeamBox List */}
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <img src="https://placehold.co/40x40/E8D2FF/8B5CF6?text=AI" alt="AI Meal Planner" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-semibold text-gray-800">AI Meal Planner</div>
                    <div className="text-sm text-gray-500">Health • 3 members</div>
                  </div>
                </div>
                <input type="radio" name="team-box-selection" className="form-radio text-purple-600 h-4 w-4" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <img src="https://placehold.co/40x40/C0E0FF/1D75BD?text=FR" alt="Founder CRM" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-semibold text-gray-800">Founder CRM</div>
                    <div className="text-sm text-gray-500">SaaS • 5 members</div>
                  </div>
                </div>
                <input type="radio" name="team-box-selection" className="form-radio text-purple-600 h-4 w-4" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <img src="https://placehold.co/40x40/D4F6C9/64A044?text=ED" alt="Eco Delivery" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-semibold text-gray-800">Eco Delivery</div>
                    <div className="text-sm text-gray-500">Logistics • 2 members</div>
                  </div>
                </div>
                <input type="radio" name="team-box-selection" className="form-radio text-purple-600 h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Verification Checkbox */}
          <div className="flex items-center mb-6">
            <input type="checkbox" id="verify-community" className="form-checkbox h-4 w-4 text-purple-600 rounded-md" />
            <label htmlFor="verify-community" className="ml-2 text-gray-600">Add my TeamBox to verified community</label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button type="submit" className="bg-purple-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:bg-purple-700 transition-colors duration-200">
              Send for Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IVC;