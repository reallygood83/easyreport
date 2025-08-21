'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function Settings() {
  const [apiKey, setApiKey] = useState<string>('');
  const [model, setModel] = useState<string>('gemini-1.5-flash');

  const handleSave = () => {
    // Save to localStorage or context, implementation later
    sessionStorage.setItem('geminiApiKey', apiKey);
    sessionStorage.setItem('geminiModel', model);
    alert('설정이 저장되었습니다.');
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>설정</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Gemini API Key</Label>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="API 키 입력"
              />
            </div>
            <div>
              <Label>모델 선택</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-1.5-flash">gemini-1.5-flash</SelectItem>
                  <SelectItem value="gemini-1.5-pro">gemini-1.5-pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSave}>저장</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}