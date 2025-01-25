import React from 'react';
import { ChefHat, UtensilsCrossed, Soup, Pizza } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Main loading animation container */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Rotating circle of icons */}
          <div className="absolute inset-0 animate-spin-slow">
            <ChefHat className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-green-500" />
            <UtensilsCrossed className="absolute top-1/2 right-0 translate-y-1/2 w-8 h-8 text-green-500" />
            <Soup className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 text-green-500" />
            <Pizza className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-green-500" />
          </div>

          {/* Central pulsing pot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-green-500 rounded-full animate-pulse flex items-center justify-center">
              <Soup className="w-10 h-10 text-white animate-bounce" />
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="relative">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Cooking up something special...</h2>
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;