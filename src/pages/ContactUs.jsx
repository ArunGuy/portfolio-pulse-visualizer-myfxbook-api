import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import facebookLogo from '../assets/images/facebook-logo.png';
import tiktokLogo from '../assets/images/tiktok-logo.png';
import youtubeLogo from '../assets/images/youtube-logo.png';

const ContactUs = () => {
  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Contact Us</h1>
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">Follow Us</h2>
          <div className="flex justify-around items-center">
            <a href="https://www.facebook.com/Mhagutsfund" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              <img src={facebookLogo} alt="Facebook" className="w-24 h-24" />
            </a>
            <a href="https://www.tiktok.com/@mhagutsfund" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
              <img src={tiktokLogo} alt="TikTok" className="w-24 h-24" />
            </a>
            <a href="https://www.youtube.com/@MoneyMoney9999-j6q" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800">
              <img src={youtubeLogo} alt="YouTube" className="w-24 h-24" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactUs;