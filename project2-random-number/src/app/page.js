'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const colors = ['bg-white', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500'];
  const [bgColor, setBgColor] = useState('bg-white');
  const [randomNumber, setRandomNumber] = useState(1);

  useEffect(() => {
    const changeState = () => {
      // Pick a random color from the tailwind color array
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      // Pick a random number between 1 and 9
      const newNumber = Math.floor(Math.random() * 9) + 1;

      setBgColor(randomColor);
      setRandomNumber(newNumber);
    };

    const intervalTime = Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;
    const interval = setInterval(changeState, intervalTime);

    return () => clearInterval(interval);
  }, [bgColor]); 

  return (
    <main className={`fixed inset-0 flex items-center justify-center transition-colors duration-500 ${bgColor}`}>
      <div className='text-[15rem] font-bold drop-shadow-lg transition-colors duration-500 text-black'>
        {randomNumber}
      </div>
    </main>
  );
}