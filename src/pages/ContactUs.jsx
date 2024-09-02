import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import CompoundInterestCalculator from '../components/CompoundInterestCalculator';
import tiktokLogo from '../assets/images/tiktok-logo.png';
import facebookLogo from '../assets/images/facebook-logo.png';
import youtubeLogo from '../assets/images/youtube-logo.png';

const ContactUs = () => {
  return (
    <div className="container mx-auto p-4 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name</Label>
                <Input id="name" name="name" required className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input type="email" id="email" name="email" required className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">Message</Label>
                <Textarea id="message" name="message" rows="4" required className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Send Message</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Follow Us</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around">
              <a href="https://www.facebook.com/Mhagutsfund" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <img src={facebookLogo} alt="Facebook" className="w-16 h-16" />
              </a>
              <a href="https://www.tiktok.com/@mhagutsfund" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                <img src={tiktokLogo} alt="TikTok" className="w-16 h-16" />
              </a>
              <a href="https://www.youtube.com/@MoneyMoney9999-j6q" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800">
                <img src={youtubeLogo} alt="YouTube" className="w-16 h-16" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Compound Interest Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <CompoundInterestCalculator />
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactUs;