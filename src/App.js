import {useEffect, useMemo, useRef, useState} from "react";
import styled from "@emotion/styled";
import bgMobile from './assets/images/bgMobile.png'
import bgDesktop from './assets/images/bgDesktop.png'
import logo from './assets/images/logo.svg'

const GOOGLE_TABLES_ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbwJk6keeTWnKBXtSPX1nKA2JglvHUsvxkve8Yj6y_1cgouZUrm0VE0Vh7_Jpz8v0I65/exec'
const SPECIAL_GROUP_AMOUNT = 50
const MIN_DESKTOP_WIDTH = 992

const Wrapper = styled.div`
    position: relative;
    min-height: 100%;
    background: url(${bgMobile}) no-repeat 0 0 / cover;
    padding: 105px 20px 90px;

    @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
        background: url(${bgDesktop}) no-repeat 0 0 / cover;
        padding: 220px 220px 144px;
    }
`

const Logo = styled.img`
    position: absolute;
    top: 33px;
    right: 33px;
    width: auto;
    height: 26px;

    @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
        top: 62px;
        right: 80px;
        height: 40px;
    }
`

const Title = styled.h2`
    font-family: 'VTB Group', sans-serif;
    font-size: 24px;
    line-height: 27px;
    font-weight: 700;
    letter-spacing: 0.01em;
    text-align: center;
    color: #1856A8;
    white-space: pre-line;
    margin: 0;

    @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
        font-size: 60px;
        line-height: 68.4px;
    }
`

const Content = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 36px;

    @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
        margin-top: 57px;
    }
`

const Groups = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 15px;

    @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
        margin-top: 26px;
    }
`

const Group = styled.div`
    border-radius: 8px;
    border: 4px solid #0192FF;
    background-color: #FFFFFF;
    
    & + & {
        margin-top: 13px;
    }

    @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
        & + & {
            margin-top: 56px;
        }
    }
`

const List = styled.ul`
    list-style: none;
`

const Item = styled.li`
    display: flex;
    align-items: center;
    padding: 13px 15px 13px 12px;
    
    & + & {
        border: 0.3px solid #0000002E;
    }

    @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
        padding: 20px 66px 22px;

        & + & {
            border: 1px solid #0000002E;
        }
    }
`

const Number = styled.p`
    font-family: 'ComicSansMS', 'VTB Group', sans-serif;
    font-size: 16px;
    line-height: 18px;
    font-weight: 400;
    letter-spacing: 0.01em;
    color: #000000;
    width: 42px;

    @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
        font-size: 24px;
        line-height: 27px;
        width: 70px;
    }
`

const Id = styled.p`
    font-family: 'ComicSansMS', 'VTB Group', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #000000;
    margin-left: 30px;

    @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
        font-size: 24px;
        line-height: 27px;
        margin-left: 90px;
    }
`

const Points = styled.p`
    font-family: 'ComicSansMS', 'VTB Group', sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #002882;
    margin-left: auto;

    @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
        font-size: 24px;
        line-height: 27px;
    }
`

const LoaderWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const Loader = styled.svg`
    height: 80px;

    @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
        height: 160px;
    }
`

const InputContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`

const InputWrapper = styled.div`
    display: inline-flex;
    position: relative;
    width: ${({opened}) => opened ? '100%' : '44px'};
    height: 44px;
    padding: ${({opened}) => opened ? '10px 12px 10px 44px' : '10px 0 10px 44px'};
    background-color: #FFFFFF;
    border-radius: 8px;
    transition: width 200ms, padding 200ms;

    @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
        width: ${({opened}) => opened ? '100%' : '74px'};
        height: 74px;
        border-radius: 13.5px;
        padding: ${({opened}) => opened ? '17px 17px 17px 74px' : '17px 0 17px 74px'};
    }
`

const Input = styled.input`
    width: 100%;
    height: 100%;
    padding: 0;
    transform-origin: left;
    outline: none;
    border: none;
    font-family: 'ComicSansMS', 'VTB Group', sans-serif;
    font-size: 16px;
    line-height: 18px;
    font-weight: 400;
    letter-spacing: 0.01em;
    color: #000000;
    
    &::placeholder {
        color: #0000004D;
    }

    @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
        font-size: 27px;
        line-height: 30px;
    }
`

const SearchIcon = styled.svg`
    position: absolute;
    width: 24px;
    height: 24px;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    cursor: pointer;
    z-index: 1;

    @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
        width: 40px;
        height: 40px;
        left: 17px;
    }
`

function SearchInput(props) {
    const {value, placeholder, onChange} = props
    const [opened, setOpened] = useState(false)
    const inputRef = useRef()

    function handleChange(e) {
        onChange?.(e.target.value)
    }

    function handleOpen() {
        setOpened(true)
        inputRef.current?.focus?.()
    }

    function handleClose() {
        setOpened(false)
    }

    const handleToggle = opened ? handleClose : handleOpen

    return (
        <InputContainer>
            <InputWrapper opened={opened}>
                <SearchIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleToggle}>
                    <circle cx="11" cy="11" r="7" stroke="#B3B3B3" strokeWidth="2.1"/>
                    <path d="M20 20L17 17" stroke="#B3B3B3" strokeWidth="2.1" strokeLinecap="round"/>
                </SearchIcon>
                <Input ref={inputRef} opened={opened} placeholder={placeholder} value={value} onChange={handleChange}/>
            </InputWrapper>
        </InputContainer>
    )
}

export function App() {
    const [leaderboard, setLeaderboard] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState('')

    const groups = useMemo(() => {
        const sorted = [...(leaderboard || [])].sort((a, b) => b.points - a.points)

        if (search) {
            const filtered = sorted.filter(item => item.id.toString().toLowerCase().includes(search.toLowerCase()))

            return [filtered]
        }

        return [sorted.slice(0, SPECIAL_GROUP_AMOUNT), sorted.slice(SPECIAL_GROUP_AMOUNT)]
    }, [leaderboard, search])

    const groupsContent = useMemo(() => {
        if (isLoading) {
            return (
                <Groups>
                    <Group>
                        <LoaderWrapper>
                            <Loader xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                                <circle fill="#002882" stroke="#002882" strokeWidth="10" r="15" cx="40" cy="100">
                                    <animate attributeName="opacity" calcMode="spline" dur="1" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
                                </circle>
                                <circle fill="#002882" stroke="#002882" strokeWidth="10" r="15" cx="100" cy="100">
                                    <animate attributeName="opacity" calcMode="spline" dur="1" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
                                </circle>
                                <circle fill="#002882" stroke="#002882" strokeWidth="10" r="15" cx="160" cy="100">
                                    <animate attributeName="opacity" calcMode="spline" dur="1" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
                                </circle>
                            </Loader>
                        </LoaderWrapper>
                    </Group>
                </Groups>
            )
        }

        return (
            <Groups>
                {groups.map((group, groupIndex) => !!group.length && (
                    <Group key={groupIndex}>
                        <List>
                            {group.map((item, itemIndex) => (
                                <Item key={itemIndex}>
                                    <Number>{itemIndex + (groupIndex * SPECIAL_GROUP_AMOUNT) + 1}</Number>
                                    <Id>{item.id}</Id>
                                    <Points>{item.points.toString().padStart(2, '0')}</Points>
                                </Item>
                            ))}
                        </List>
                    </Group>
                ))}
            </Groups>
        )
    }, [groups, isLoading])

    useEffect(() => {
        setIsLoading(true)

        fetch(GOOGLE_TABLES_ENDPOINT_URL, { redirect: 'follow' },)
            .then(resp => resp.json())
            .then(resp => resp?.reduce((acc, [id, name, email, points]) => {
                if (id && name && email) {
                    return [...acc, {id, name, email, points: +points || 0}]
                }

                return acc
            }, []))
            .then(setLeaderboard)
            .catch(console.log)
            .finally(() => setIsLoading(false))
    }, []);

    return (
        <Wrapper>
            <Logo src={logo} />
            <Title>Рейтинг игроков{'\n'}«Вот эТо Башня»</Title>
            <Content>
                <SearchInput placeholder="Введи свой ID" value={search} onChange={setSearch} />
                {groupsContent}
            </Content>
        </Wrapper>
    )
}