'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
export default function Settings() {
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>('gemini-1.5-flash');
  const [downloadFolder, setDownloadFolder] = useState<string>('');

  const handleSave = () => {
    // Save to localStorage or context, implementation later
    sessionStorage.setItem('geminiApiKey', apiKey);
    sessionStorage.setItem('geminiModel', model);
    sessionStorage.setItem('downloadFolder', downloadFolder);
    alert('설정이 저장되었습니다.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                설정
              </h1>
              <p className="text-sm text-gray-500">Easy Report 환경설정</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              홈으로
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">환경 설정</CardTitle>
            <p className="text-gray-600">AI 보고서 생성을 위한 설정을 관리하세요</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* API Key Section */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Gemini API 키
              </Label>
              <p className="text-sm text-gray-500">Google AI Studio에서 발급받은 API 키를 입력하세요</p>
              <Input
                id="apiKey"
                type="password"
                placeholder="API 키를 입력하세요"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="border-blue-200 focus:border-blue-400 focus:ring-blue-200"
              />
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            {/* Model Selection */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI 모델 선택
              </Label>
              <p className="text-sm text-gray-500">사용할 Gemini 모델을 선택하세요</p>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-200">
                  <SelectValue placeholder="모델을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-1.5-flash">⚡ Gemini 1.5 Flash (빠름)</SelectItem>
                  <SelectItem value="gemini-1.5-pro">🎯 Gemini 1.5 Pro (정확함)</SelectItem>
                  <SelectItem value="gemini-2.0-flash">🚀 Gemini 2.0 Flash (최신)</SelectItem>
                  <SelectItem value="gemini-2.0-pro">💎 Gemini 2.0 Pro (최고급)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            {/* Download Folder */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5L12 5H5a2 2 0 00-2 2z" />
                </svg>
                다운로드 폴더
              </Label>
              <p className="text-sm text-gray-500">보고서를 저장할 폴더 경로를 지정하세요 (선택사항)</p>
              <Input
                id="downloadFolder"
                type="text"
                placeholder="예: /Users/사용자명/Documents/Reports"
                value={downloadFolder}
                onChange={(e) => setDownloadFolder(e.target.value)}
                className="border-green-200 focus:border-green-400 focus:ring-green-200"
              />
              <p className="text-xs text-gray-400">비워두면 브라우저 다운로드로 처리됩니다</p>
            </div>

            {/* Save Button */}
            <div className="pt-6">
              <Button 
                onClick={handleSave}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                설정 저장
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}