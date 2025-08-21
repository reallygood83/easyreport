'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useDropzone } from 'react-dropzone';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [sample, setSample] = useState<string>('');
  const [useSampleFile, setUseSampleFile] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [language, setLanguage] = useState<string>('Korean');
  const [volume, setVolume] = useState<string>('medium');
  const [needsTable, setNeedsTable] = useState<boolean>(false);
  const [needsGraph, setNeedsGraph] = useState<boolean>(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > 5) {
      alert('최대 5개의 파일만 업로드할 수 있습니다.');
      return;
    }
    setFiles([...files, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: '.md', maxFiles: 5 });

  const handleSampleFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => setSample(e.target.result as string);
      reader.readAsText(acceptedFiles[0]);
    }
  };

  const sampleDropzone = useDropzone({ onDrop: handleSampleFileDrop, accept: '.md', maxFiles: 1 });

  const handleGenerate = async () => {
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

    const filesContents = await Promise.all(
      files.map((file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result as string);
          reader.readAsText(file);
        })
      )
    );

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
        volume,
        needsTable,
        needsGraph,
      }),
    });

    if (!response.ok) {
      alert('보고서 생성에 실패했습니다.');
      return;
    }

    const { report } = await response.json();

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_report.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <Link href="/settings">
          <Button variant="outline">설정</Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Easy Report Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label>참고 문서 업로드 (최대 5개, .md 파일)</Label>
              <div {...getRootProps()} className="border-2 border-dashed p-4 rounded-md">
                <input {...getInputProps()} />
                <p>파일을 드래그하거나 클릭하여 업로드</p>
              </div>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <Label>샘플 보고서</Label>
              <Select onValueChange={(value) => setUseSampleFile(value === 'file')}>
                <SelectTrigger>
                  <SelectValue placeholder="샘플 입력 방식 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prompt">프롬프트 입력</SelectItem>
                  <SelectItem value="file">파일 업로드</SelectItem>
                </SelectContent>
              </Select>
              {useSampleFile ? (
                <div {...sampleDropzone.getRootProps()} className="border-2 border-dashed p-4 rounded-md mt-2">
                  <input {...sampleDropzone.getInputProps()} />
                  <p>샘플 파일을 드래그하거나 클릭하여 업로드</p>
                </div>
              ) : (
                <Textarea
                  placeholder="샘플 보고서 형식 입력"
                  value={sample}
                  onChange={(e) => setSample(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            <Separator />

            <div>
              <Label>보고서 지침 (목적, 강조 사항 등)</Label>
              <Textarea
                placeholder="보고서의 성격, 목적, 강조 사항 입력"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div>
              <Label>보고서 언어</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Korean">한국어</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Chinese">中文</SelectItem>
                  <SelectItem value="Japanese">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>문서 양</Label>
              <Select value={volume} onValueChange={setVolume}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="needsTable" checked={needsTable} onCheckedChange={setNeedsTable} />
                <Label htmlFor="needsTable">표 필요</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="needsGraph" checked={needsGraph} onCheckedChange={setNeedsGraph} />
                <Label htmlFor="needsGraph">그래프 필요</Label>
              </div>
            </div>

            <Button onClick={handleGenerate}>보고서 생성</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
