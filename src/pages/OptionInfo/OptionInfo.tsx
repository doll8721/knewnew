import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';
import styled from 'styled-components';
import Loading from '../../components/Status/Loading';
import Error from '../../components/Status/Error';
import { UserInfoProps } from '../../types/login/index';
import { OptionProps } from '../../types/optionInfo/index';
import { BASE_URL } from '../../api/utils';
import { IoIosArrowBack } from 'react-icons/io';
import { AiOutlineCheck } from 'react-icons/ai';

export default function OptionInfo({ userInfo }: { userInfo: UserInfoProps }) {
  const navigate = useNavigate();
  const [enabled, setEnabled] = useState(false);
  const [etcValue, setEtcValue] = useState<string>('');
  const [inputValue, setInputValue] = useState<OptionProps>({});
  const isDisabled = Object.keys(inputValue).length !== OPTION_DATA.length;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.occupation == '') {
      alert('직업을 입력해 주세요!');
      return;
    }

    mutate();
  };

  const setOptionInfo = () => {
    return axios.post(
      `${BASE_URL}/user/introduction`,
      {
        introduction_tags: [
          inputValue.style,
          inputValue.family,
          inputValue.occupation,
        ],
      },
      {
        headers: { Authorization: `Bearer ${userInfo.access_token}` },
      }
    );
  };

  const { isLoading, isError, mutate } = useMutation(setOptionInfo, {
    onSuccess: () => {
      navigate('/');
      alert('뉴뉴에 오신 것을 환영합니다 (>_<)/');
    },
    retry: false,
  });

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }

  return (
    <Container>
      <NoBorderHeader>
        <ToBack onClick={() => navigate(-1)}>
          <IoIosArrowBack />
        </ToBack>
      </NoBorderHeader>
      <OptionInfoWrap>
        <Greeting>
          <User>{userInfo.nickname}</User>님 반가워요!
        </Greeting>
        <Bold>슬기로운 뉴뉴생활을 위해 나를 소개해주세요.</Bold>
        <Description>
          작성하신 정보는 다른 유저들에게 보여지며,
          <br />
          7일에 한 번 마이페이지에서 수정할 수 있습니다.
        </Description>
        <OptionForm onSubmit={handleSubmit}>
          {OPTION_DATA.map(({ id, title, name, option }) => {
            return (
              <OptionBox key={id}>
                <StepNum>Step.{id}</StepNum>
                <div>
                  <Title>{title}</Title>
                  <OptionWrap>
                    {option.map((choice, idx) => {
                      return (
                        <RadioInputWrap key={idx}>
                          {choice !== '기타' ? (
                            <>
                              <RadioInput
                                type="radio"
                                name={name}
                                value={choice}
                                onChange={handleInput}
                                onFocus={() => setEnabled(false)}
                              />
                              <label>{choice}</label>
                            </>
                          ) : (
                            <>
                              <RadioInput
                                type="radio"
                                name="occupation"
                                onFocus={() => {
                                  setEnabled(true);
                                  setInputValue({
                                    ...inputValue,
                                    occupation: etcValue,
                                  });
                                }}
                              />
                              <label>기타</label>
                              <EtcInput
                                type="text"
                                name="occupation"
                                value={etcValue}
                                placeholder="직접 입력해주세요"
                                onChange={e => {
                                  setEtcValue(e.target.value);
                                  setInputValue({
                                    ...inputValue,
                                    occupation: e.target.value,
                                  });
                                }}
                                disabled={!enabled}
                              />
                            </>
                          )}
                        </RadioInputWrap>
                      );
                    })}
                  </OptionWrap>
                </div>
                {Object.keys(inputValue).includes(name) && (
                  <Complete>
                    <AiOutlineCheck />
                    완료
                  </Complete>
                )}
              </OptionBox>
            );
          })}
          <NextButton disabled={isDisabled}>다음으로</NextButton>
        </OptionForm>
      </OptionInfoWrap>
    </Container>
  );
}

const OPTION_DATA = [
  {
    id: 1,
    title: '푸드 스타일을 알려주세요!',
    name: 'style',
    option: [
      '간단함파',
      '직접요리파',
      '건강추구파',
      '가성비좋아',
      '비싸도FLEX',
      '이색파',
    ],
  },
  {
    id: 2,
    title: '몇명이서 살고 계신가요?',
    name: 'family',
    option: ['1인가구', '2인가구', '3인이상가구'],
  },
  {
    id: 3,
    title: '무슨 일을 하시나요?',
    name: 'occupation',
    option: ['학생', '직장인', '주부', '기타'],
  },
];

const Container = styled.div`
  margin: 0 auto 100px;

  @media (min-width: 768px) {
    width: 748px;
  }
`;

export const Header = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 34px 0;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  font-size: 20px;
  z-index: 10;

  svg {
    font-size: 30px;
  }

  @media (min-width: 768px) {
    width: 748px;
  }

  @media (max-width: 767px) {
    left: 10px;
    right: 10px;
    padding: 29px 0;
    font-size: 16px;

    svg {
      font-size: 20px;
    }
  }
`;

export const ToBack = styled.div`
  position: absolute;
  left: 5px;

  svg:hover {
    cursor: pointer;
  }
`;

const NoBorderHeader = styled(Header)`
  border-bottom: 1px solid transparent;
`;

const OptionInfoWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-width: 410px;
  padding: 20px;
`;

const Greeting = styled.div`
  margin: 86px 0 37px;
  letter-spacing: 1px;
  font-size: 29px;

  @media (max-width: 767px) {
    margin-top: 80px;
  }
`;

const User = styled.span`
  color: ${({ theme }) => theme.colors.red};
  font-weight: 600;
`;

const Bold = styled.div`
  font-weight: 600;
`;

const Description = styled.div`
  color: ${({ theme }) => theme.colors.black80};
  line-height: 22px;
  font-size: 17px;
  font-weight: 300;
`;

const OptionForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OptionBox = styled.div`
  position: relative;
  display: flex;
  gap: 30px;
  padding: 30px;
  border: 1px solid ${({ theme }) => theme.colors.white50};
  border-radius: 15px;
`;

const StepNum = styled.div`
  font-weight: 600;
`;

const Title = styled.div`
  margin-bottom: 20px;
  font-size: 19px;
  font-weight: 600;
`;

const OptionWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const RadioInputWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1px 0;
`;

const RadioInput = styled.input`
  width: 15px;
  height: 15px;
  accent-color: ${({ theme }) => theme.colors.red};
  cursor: pointer;
`;

const EtcInput = styled.input`
  height: 100%;
  padding-top: 1px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.white50};
  font-size: 15px;
`;

const Complete = styled.div`
  position: absolute;
  right: 37px;
  display: flex;
  gap: 5px;
  color: ${({ theme }) => theme.colors.red};
`;

const NextButton = styled.button`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.red};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.red};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    color: ${({ theme }) => theme.colors.black50};
    border: 1px solid ${({ theme }) => theme.colors.white50};

    &:hover {
      color: ${({ theme }) => theme.colors.black50};
      border: 1px solid ${({ theme }) => theme.colors.white50};
      background: ${({ theme }) => theme.colors.white};
    }
  }

  &:hover {
    background: ${({ theme }) => theme.colors.red};
    color: ${({ theme }) => theme.colors.white};
  }
`;
