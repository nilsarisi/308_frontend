import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const App = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <hr />
            <div className="flex w-full">
                <Sidebar />
                <main className="flex-grow p-4">
                    {/* Main content goes here */}
                    <h1>Welcome to the Admin Dashboard</h1>
                </main>
            </div>
        </div>
    );
};

export default App;
