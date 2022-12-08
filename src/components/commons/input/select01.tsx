import { SearchOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { Divider } from 'antd';
import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  FieldValues,
  UseFormRegisterReturn,
  UseFormSetValue,
} from 'react-hook-form';
import { styleSet } from '../../../commons/styles/styleSet';
import Btn01 from '../button/btn01';
import Check01 from './check01';

interface ISelectProps {
  text: string;
  register?: UseFormRegisterReturn;
  setValue?: UseFormSetValue<FieldValues>;
  data?: string[];
  role?: string;
}

interface IStyle {
  active?: boolean;
}

const Select01 = (props: ISelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [saveChecked, setSaveChecked] = useState<string[]>([]);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');
  const onCheckedAll = useCallback(
    (checked) => {
      if (checked) {
        const checkedListArray: string[] = [];
        props.data?.forEach((list) => checkedListArray.push(list));
        setCheckedList(checkedListArray);
      } else setCheckedList([]);
    },
    [props.data],
  );

  const onCheckedElement = useCallback(
    (checked, list) => {
      if (checked) setCheckedList([...checkedList, list]);
      else setCheckedList(checkedList.filter((el) => el !== list));
    },
    [checkedList],
  );

  const onClickToggleModal = () => {
    setIsOpen((prev) => !prev);
  };

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };
  const label = (role: string | undefined) => {
    if (role === 'organization') {
      return <Label>팀</Label>;
    }
    if (role === 'duty') {
      return <Label>직무</Label>;
    }
  };

  const onClickBackground = (e: MouseEvent) => {
    if (e.currentTarget.id !== 'selectZone') {
      setCheckedList(saveChecked);
      props.setValue?.('duty', saveChecked);
      setIsOpen(false);
    }
  };

  const onClickSaveChecked = () => {
    setSaveChecked(checkedList);
    setIsOpen(false);
  };

  useEffect(() => {
    props.setValue?.('duty', saveChecked);
  }, [saveChecked]);
  return (
    <>
      {isOpen && <Background onClick={onClickBackground}></Background>}
      <Wrapper>
        <ToggleButton
          className="selectZone"
          active={isOpen ? true : false}
          type="button"
          onClick={onClickToggleModal}
        >
          {label(props.role)}
          {checkedList.length ? (
            <span>{checkedList.length} 선택됨</span>
          ) : props.data?.length ? (
            '선택 안됨'
          ) : (
            '선택 가능한 옵션 없음'
          )}
        </ToggleButton>
        {isOpen && (
          <DrowDownMenu id="selectZone">
            <SearchBox>
              <SearchOutlined className="searchIcon" />
              <SearchInput
                value={keyword}
                onChange={onChangeInput}
                type="text"
                placeholder="검색"
              />
            </SearchBox>
            <OptionBox>
              <Check01
                text="모두 선택"
                checked={
                  checkedList.length === 0
                    ? false
                    : checkedList.length === props.data?.length
                    ? true
                    : false
                }
                onChange={(event) => onCheckedAll(event.target.checked)}
              />
              <Options className="options">
                <Divider style={{ margin: '0.5rem 0' }} />
                {props.data && props.data.length > 0
                  ? props.data
                      ?.filter((el) => el.includes(keyword))
                      .map((el) => (
                        <Check01
                          key={el}
                          text={el}
                          checked={checkedList.includes(el) ? true : false}
                          onChange={(event) =>
                            onCheckedElement(event.target.checked, el)
                          }
                        />
                      ))
                  : null}
              </Options>
            </OptionBox>
            <Btn01
              text="적용하기"
              type="button"
              bdC="#ddd"
              onClick={onClickSaveChecked}
            />
          </DrowDownMenu>
        )}
      </Wrapper>
      <InvisibleInput {...props.register} />
    </>
  );
};

export default Select01;

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const ToggleButton = styled.button`
  max-width: 350px;
  padding: 0.5rem 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  border-radius: 0;
  border: 1px solid
    ${(props: IStyle) => (props.active ? styleSet.colors.primary : '#ddd')};
  background-color: ${(props: IStyle) =>
    props.active ? styleSet.colors.subColor05 : '#fff'};

  ::after {
    display: inline-block;
    margin-left: 0.255em;
    vertical-align: 0.255em;
    content: '';
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
  }
  transition: all 0.3s ease;

  :hover {
    background-color: ${(props: IStyle) =>
      props.active ? styleSet.colors.subColor05 : '#ffdddd'};
  }
`;

const DrowDownMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  min-width: 15rem;
  position: absolute;
  top: 100%;
  left: 0;
  padding: 0.5rem 0;
  margin-top: 1rem;
  border: 1px solid #ddd;
  background-color: white;
  box-shadow: 0 4px 16px rgb(130 135 147 / 36%);
  z-index: 99;

  & > * {
    max-width: 220px;
    width: 100%;
    margin: 0 auto;
  }
`;

const SearchBox = styled.div`
  position: relative;
  .searchIcon {
    position: absolute;
    padding: 0.6rem 0.5rem;
  }
`;

const SearchInput = styled.input`
  display: block;
  border: 1px solid #ddd;
  outline: none;
  padding: 0.5rem 1rem 0.5rem 2rem;
  :focus {
    border: 1px soild #ddd;
  }
`;

const OptionBox = styled.div`
  margin-left: 1rem;
`;

const Options = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  padding-right: 1rem;
`;

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
`;

const InvisibleInput = styled.input`
  display: none;
`;