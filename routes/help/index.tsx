import React from 'react';
import { Search, Book, MessageCircle, LifeBuoy, FileText, ChevronRight } from 'lucide-react';
import { Input, Card, CardContent } from '../../components/ui';

export const HelpCenterPage = () => {
   return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">
         <div className="text-center space-y-4 py-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">How can we help you?</h1>
            <div className="relative max-w-lg mx-auto">
               <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
               <Input className="pl-10 h-12 text-lg shadow-md border-slate-200 dark:border-white/10 dark:bg-black" placeholder="Search for answers..." />
            </div>
         </div>

         <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:border-indigo-200 dark:bg-black dark:border-white/20 dark:hover:border-indigo-800 transition-colors cursor-pointer">
               <CardContent className="p-6 space-y-3 text-center">
                  <div className="h-12 w-12 mx-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                     <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Documentation</h3>
                  <p className="text-sm text-slate-500">Guides and reference materials for configuration.</p>
               </CardContent>
            </Card>
            <Card className="hover:border-indigo-200 dark:bg-black dark:border-white/20 dark:hover:border-indigo-800 transition-colors cursor-pointer">
               <CardContent className="p-6 space-y-3 text-center">
                  <div className="h-12 w-12 mx-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                     <MessageCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Community Forum</h3>
                  <p className="text-sm text-slate-500">Connect with other users and share solutions.</p>
               </CardContent>
            </Card>
            <Card className="hover:border-indigo-200 dark:bg-black dark:border-white/20 dark:hover:border-indigo-800 transition-colors cursor-pointer">
               <CardContent className="p-6 space-y-3 text-center">
                  <div className="h-12 w-12 mx-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                     <LifeBuoy className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Contact Support</h3>
                  <p className="text-sm text-slate-500">Get in touch with our technical support team.</p>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Popular Articles</h2>
            <div className="grid gap-2">
               {['Setting up your first bridge config', 'Understanding topology nodes', 'Database backup best practices', 'Troubleshooting API latency'].map((article, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                     <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{article}</span>
                     </div>
                     <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};