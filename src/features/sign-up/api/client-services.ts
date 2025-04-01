type SignUpProps = {
  name: string;
  email: string;
  password: string;
};

export const postSignUp = async (sign_up_data: SignUpProps) => {
  try {
    const response = await fetch('/api/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sign_up_data),
    });

    if (!response.ok) {
      throw new Error('회원가입 요청에 실패했습니다');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
