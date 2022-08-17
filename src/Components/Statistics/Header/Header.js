import React, { useEffect, useState } from 'react'
import BorderButton from '../../CommonComponents/Button/BorderButton';
import { CustomButton } from '../../CommonComponents/Button/Button';
import { ButtonGroup } from "react-bootstrap";
import { useHistory } from 'react-router-dom';

export const TopbarData = {
  Statistics: {
    id: 0,
    name: "Statistics",
    path: "/statistics"
  },
  Budgets: {
    id: 1,
    name: "Budgets",
    path: "/statistics/budgets"
  },
}

export default function Header() {
  const [selectedTab, setSelectedTab] = useState(TopbarData.Statistics.id);
  const history = useHistory();

  const handleSelectMode = (mode) => {
    history.push(mode.path);
  }

  useEffect(() => {
    const url = window.location.href;

    if (url.includes("budgets")) {
      setSelectedTab(TopbarData.Budgets.id);
      return
    }
    setSelectedTab(TopbarData.Statistics.id);
  }, [window.location.href])

  return (
    <ButtonGroup className="task-form__button-group">
      {Object.keys(TopbarData).map((key) => {
        if (TopbarData[key].id === selectedTab)
          return <CustomButton key={key}>{TopbarData[key].name}</CustomButton>;

        return (
          <BorderButton
            border={{ size: 2 }}
            callback={() => handleSelectMode(TopbarData[key])}
            key={key}
          >
            {TopbarData[key].name}
          </BorderButton>
        );
      })}
    </ButtonGroup>
  )
}
