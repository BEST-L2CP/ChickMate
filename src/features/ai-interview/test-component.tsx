'use client';

import { speakText } from '@/features/ai-interview/api/client-services';

const TTSComponent = () => {
  const handleClick = async () => {
    try {
      await speakText({
        text: '최창연 씨, 탐색 시간을 정의하는 방법과 사용자 테스트를 통해 결과를 도출한 방식은 이해했습니다. 그러나, 사용하신 사용자 테스트의 샘플 크기와 방법론은 무엇이었는지 명확하게 설명해 주셔야 합니다. 재방문율의 증가는 긍정적인 신호이나, 그 수치가 통계적으로 유의미한지 여부는 어느 정도였는지에 대한 자료를 제시해 주실 수 있습니까? 그리고 정보가 직관적이다는 피드백을 수집한 방법에 대해서도 구체적으로 말씀해 주십시오.',
        type: 'PRESSURE',
      });
    } catch (error) {
      // TODO : ERROR 처리
      alert(error.message);
    }
  };
  return (
    <div>
      <button onClick={handleClick}>테스트</button>
    </div>
  );
};

export default TTSComponent;
