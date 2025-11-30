"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BarChart3, Calendar, ChevronRight,Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore"; // Import store
import SignOutButton from "@/components/logOutButton";
import { LoaderFour } from "@/components/ui/loader";


interface Interview {
  id: string;
  jobDescription: string;
  finalScore: number;
  createdAt: string;
}

export default function Dashboard() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isCheckingAuth,setIsCheckingAuth]=useState(true)
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore(); // <--- Get User
  const router = useRouter();


  useEffect(() => {
    if(user){
      axios.get(`http://localhost:4000/api/interviews?userId=${user?.id ?? ""}`)
      .then((res) => {
        setInterviews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    }
  
  }, [user]);
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <LoaderFour />
      </div>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Your Interviews</h1>
                <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.email}</p>
            </div>
            
            <div className="flex gap-3">
                {/* 2. ADD LOGOUT BUTTON HERE */}
                <SignOutButton />
                
                <button 
                    onClick={() => router.push("/")} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
                >
                    + New Interview
                </button>
            </div>
        </div>
          <div className="flex justify-between items-center mb-8">
            <div className="h-9 w-48 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-10 w-36 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>

          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
              >
                <div className="h-6 w-3/4 bg-slate-200 rounded mb-4 animate-pulse"></div>
                <div className="flex items-center gap-4">
                  <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Your Interviews</h1>
                <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.email}</p>
            </div>
            
            <div className="flex gap-3">
                <SignOutButton />
                <button onClick={() => router.push("/")} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    + New Interview
                </button>
            </div>
        </div>

        <div className="grid gap-4">
          {interviews.map((item) => (
            <div 
                key={item.id} 
                onClick={() => router.push(`/dashboard/${item.id}`)}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer flex justify-between items-center"
            >
              <div>
                <h2 className="font-bold text-lg text-slate-800 mb-1">
                    {item.jobDescription.substring(0, 50)}...
                </h2>
                <div className="flex items-center text-slate-500 text-sm gap-4">
                    <span className="flex items-center gap-1">
                        <Calendar size={14} /> 
                        {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <BarChart3 size={14} /> 
                        Score: <span className={`font-bold ${item.finalScore > 70 ? 'text-green-600' : 'text-orange-500'}`}>{item.finalScore}%</span>
                    </span>
                </div>
              </div>
              <ChevronRight className="text-slate-400" />
            </div>
          ))}
          
          {interviews.length === 0 && (
              <p className="text-center text-slate-500 mt-10">No interviews yet. Go take one!</p>
          )}
        </div>
      </div>
    </main>
  );
}