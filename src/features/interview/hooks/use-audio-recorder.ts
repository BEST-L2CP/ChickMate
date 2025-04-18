import { useEffect, useRef, useState } from 'react';
import { INTERVIEW_MESSAGE } from '@/constants/message-constants';

const { MIC_ACCESS } = INTERVIEW_MESSAGE;

export const useAudioRecorder = () => {
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  //녹음 시작
  const startRecording = async () => {
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'audio/webm;codecs=opus',
      });
      audioRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // 녹음 중 MediaRecorder가 데이터를 제공할 때마다 조각(chunk)을 audioChunksRef에 추가함
      // 녹음 중 데이터가 쪼개져서 순차적으로 들어오는 구조임
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // 실제 녹음을 시작함
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      alert('MIC_ACCESS');
    }
  };

  // 녹음 중단
  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve) => {
      if (!audioRecorderRef.current) return;

      audioRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        resolve(blob);
      };

      audioRecorderRef.current?.stop();
      setIsRecording(false);
    });
  };

  const cleanupResources = () => {
    if (audioRecorderRef.current && isRecording) {
      audioRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, []);

  return { isRecording, audioBlob, startRecording, stopRecording };
};
