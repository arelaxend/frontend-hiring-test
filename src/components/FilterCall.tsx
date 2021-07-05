import { ArchiveOutlined, CalendarOutlined, Checkbox, CloseOutlined, Dropdown, DropdownButton, InboundOutlined, Menu, MenuItem, OutboundOutlined, PreferencesOutlined, Spacer, Toggle, TransferOutlined, VoicemailOutlined } from "@aircall/tractor";
import { useSet, useToggle } from "ahooks";
import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "../store";
import { setFilters } from "../store/get/actions";
import { initialFilters } from "../store/get/reducer";

const FilterCall = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: any) => state.get);

  const icon = (filter: string, height: number) => {
    switch (filter) {
      case "missed":
        return <CloseOutlined height={height} />;
      case "voicemail":
        return <VoicemailOutlined height={height} />;
      case "inbound":
        return <InboundOutlined height={height} />;
      case "outbound":
        return <OutboundOutlined height={height} />;
      case "archived":
        return <ArchiveOutlined height={height} />;
      default:
        return <TransferOutlined height={height} />;
    }
  };

  const [filtersSet, { add, has, remove }] = useSet<string>(filters);

  const [groupByDate, { toggle }] = useToggle();

  useEffect(() => {
    dispatch(setFilters(Array.from(filtersSet).concat(groupByDate ? ["groupbydate"] : [])));
  }, [dispatch, filtersSet, groupByDate]);

  return (
    <Dropdown
      closeOnInsideClick={false}
      trigger={
        <DropdownButton
          mode="link"
          variant="primary"
          iconClose={<PreferencesOutlined />}
        >
          Filters
        </DropdownButton>
      }
      position="bottom"
      anchor="end"
    >
      <Menu>
        <MenuItem key="groupbydate" justifyContent="space-between" onClick={() => toggle()}>
          <CalendarOutlined /> by date
          <Spacer justifyContent="center" alignItems="center" width={40}>
            <Toggle size="small" checked={groupByDate} />
          </Spacer>
        </MenuItem>
        {initialFilters.map((filter: string) => (
          <MenuItem
            key={filter}
            justifyContent="space-between"
            onClick={() => (has(filter) ? remove(filter) : add(filter))}
          >
            {icon(filter, 20)} {filter}
            <Spacer justifyContent="center" alignItems="center" width={40}>
              <Checkbox size="regular" checked={has(filter)} />
            </Spacer>
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  );
};

const areEqual = (prevs: any, nexts: any) => {
  return prevs.onUpdate === nexts.onUpdate;
};

export default React.memo(FilterCall, areEqual);