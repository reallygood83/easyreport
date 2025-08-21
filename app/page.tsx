'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useDropzone } from 'react-dropzone';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [sample, setSample] = useState<string>('');
  const [useSampleFile, setUseSampleFile] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [language, setLanguage] = useState<string>('Korean');
  const [pages, setPages] = useState<number>(5);
  const [needsTable, setNeedsTable] = useState<boolean>(false);
  const [needsGraph, setNeedsGraph] = useState<boolean>(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > 5) {
      alert('최대 5개의 파일만 업로드할 수 있습니다.');
      return;
    }
    setFiles([...files, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'text/markdown': ['.md'] }, maxFiles: 5 });

  const handleSampleFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      console.log('Sample file dropped:', acceptedFiles[0].name);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('Sample file loaded:', e.target?.result);
        setSample(e.target?.result as string ?? '');
      };
      reader.readAsText(acceptedFiles[0]);
    }
  };

  const sampleDropzone = useDropzone({ onDrop: handleSampleFileDrop, accept: { 'text/markdown': ['.md'] }, maxFiles: 1 });

  const handleGenerate = async () => {
    try {
      console.log('Generate button clicked');
      if (files.length === 0) {
        alert('참고 문서를 업로드해주세요.');
        return;
      }
      if (!sample) {
        alert('샘플 보고서를 입력해주세요.');
        return;
      }

      const apiKey = sessionStorage.getItem('geminiApiKey');
      const model = sessionStorage.getItem('geminiModel') || 'gemini-1.5-flash';

      if (!apiKey) {
        alert('설정에서 Gemini API 키를 입력해주세요.');
        return;
      }

      console.log('Reading file contents...');
      const filesContents = await Promise.all(
        files.map((file) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve((e.target?.result as string) ?? '');
            reader.readAsText(file);
          })
        )
      );
      console.log('File contents read');

      console.log('Fetching /api/generate...');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          model,
          filesContents,
          sample,
          prompt,
          language,
          pages,
          needsTable,
          needsGraph,
        }),
      });
      console.log('Fetch response:', response.status);

      if (!response.ok) {
        let errDetail = '';
        try {
          const err = await response.json();
          errDetail = err?.message || err?.error || '';
        } catch {
          try {
            errDetail = await response.text();
          } catch {}
        }
        throw new Error(`보고서 생성에 실패했습니다.${errDetail ? ' 서버 메시지: ' + errDetail : ''}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      if (data.savedPath) {
        alert(`보고서가 ${data.savedPath}에 저장되었습니다.`);
      } else {
        const { report } = data;
        const blob = new Blob([report], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated_report.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error in report generation:', error);
      alert('보고서 생성 중 오류가 발생했습니다: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Easy Report
              </h1>
              <p className="text-sm text-gray-500">AI-Powered Report Generator</p>
            </div>
          </div>
          <Link href="/settings">
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              설정
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">보고서 생성하기</CardTitle>
            <p className="text-gray-600">AI가 도와주는 스마트한 보고서 작성</p>
          </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-8">
            {/* File Upload Section */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                참고 문서 업로드
              </Label>
              <p className="text-sm text-gray-500 mb-3">최대 5개의 .md 파일을 업로드하세요</p>
              <div {...getRootProps()} className="border-2 border-dashed border-blue-200 bg-blue-50/50 p-8 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                <input {...getInputProps()} />
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto text-blue-400 group-hover:text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 font-medium">파일을 드래그하거나 클릭하여 업로드</p>
                  <p className="text-sm text-gray-400 mt-1">Markdown 파일만 지원됩니다</p>
                </div>
              </div>
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-600">업로드된 파일:</p>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-700">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            {/* Sample Report Section */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                샘플 보고서
              </Label>
              <Select onValueChange={(value) => setUseSampleFile(value === 'file')}>
                <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-200">
                  <SelectValue placeholder="샘플 입력 방식을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prompt">직접 입력</SelectItem>
                  <SelectItem value="file">파일 업로드</SelectItem>
                </SelectContent>
              </Select>
              {useSampleFile ? (
                <div {...sampleDropzone.getRootProps()} className="border-2 border-dashed border-purple-200 bg-purple-50/50 p-6 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 cursor-pointer group">
                  <input {...sampleDropzone.getInputProps()} />
                  <div className="text-center">
                    <svg className="w-10 h-10 mx-auto text-purple-400 group-hover:text-purple-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600 font-medium">샘플 파일을 업로드하세요</p>
                  </div>
                </div>
              ) : (
                <Textarea
                  placeholder="원하는 보고서 형식이나 스타일을 설명해주세요..."
                  value={sample}
                  onChange={(e) => setSample(e.target.value)}
                  className="min-h-[120px] border-purple-200 focus:border-purple-400 focus:ring-purple-200 resize-none"
                />
              )}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

            {/* Report Instructions */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                보고서 지침
              </Label>
              <p className="text-sm text-gray-500">보고서의 목적, 강조사항, 특별한 요구사항을 입력하세요</p>
              <Textarea
                placeholder="예: 경영진 대상 분기별 성과 보고서, 데이터 중심의 객관적 분석 필요..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] border-green-200 focus:border-green-400 focus:ring-green-200 resize-none"
              />
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-700 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  언어 설정
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Korean">🇰🇷 한국어</SelectItem>
                    <SelectItem value="English">🇺🇸 English</SelectItem>
                    <SelectItem value="Chinese">🇨🇳 中文</SelectItem>
                    <SelectItem value="Japanese">🇯🇵 日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-700 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  페이지 수
                </Label>
                <Input 
                  type="number" 
                  value={pages} 
                  onChange={(e) => setPages(parseInt(e.target?.value || '5') || 5)} 
                  min={1} 
                  className="border-orange-200 focus:border-orange-400 focus:ring-orange-200"
                  placeholder="A4 기준 페이지 수"
                />
              </div>
            </div>

            {/* Additional Options */}
            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              <Label className="text-lg font-semibold text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                추가 옵션
              </Label>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200">
                  <Checkbox 
                    id="needsTable" 
                    checked={needsTable} 
                    onCheckedChange={(checked) => setNeedsTable(checked === true)}
                    className="border-teal-300 data-[state=checked]:bg-teal-500"
                  />
                  <Label htmlFor="needsTable" className="font-medium text-gray-700 cursor-pointer">📊 표 포함</Label>
                </div>
                <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200">
                  <Checkbox 
                    id="needsGraph" 
                    checked={needsGraph} 
                    onCheckedChange={(checked) => setNeedsGraph(checked === true)}
                    className="border-teal-300 data-[state=checked]:bg-teal-500"
                  />
                  <Label htmlFor="needsGraph" className="font-medium text-gray-700 cursor-pointer">📈 그래프 포함</Label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4">
              <Button 
                onClick={handleGenerate} 
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI 보고서 생성하기
              </Button>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
