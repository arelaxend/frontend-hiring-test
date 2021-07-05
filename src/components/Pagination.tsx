import { Button, Spacer } from "@aircall/tractor";
import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "../store";
import { setOffsets } from "../store/get/actions";

const Pagination = ({
  hasNextPage,
}: {
  hasNextPage: boolean;
}) => {
  const dispatch = useDispatch();
  const { count, pageOffset, loadOffset } = useSelector((state: any) => state.get);

  useEffect(() => {
    const maxPageOffset: number = Math.floor(count / 10);
    if (pageOffset > maxPageOffset) {
      dispatch(setOffsets(maxPageOffset, loadOffset));
    }
  }, [count, dispatch, loadOffset, pageOffset]);

  return (
    <Spacer justifyContent="left" alignItems="left" space={3}>
      <Button
        size="regular"
        variant="darkGhost"
        disabled={pageOffset === 0}
        onClick={() => {
          dispatch(setOffsets(pageOffset - 1, loadOffset - 1));
        }}
      >
        Prev
      </Button>
      <Button
        size="regular"
        variant="darkGhost"
        disabled={!hasNextPage}
        onClick={() => {
          dispatch(setOffsets(pageOffset + 1, loadOffset + 1));
        }}
      >
        Next
      </Button>
    </Spacer>
  );
};

const areEqual = () => {
  return false;
};

export default React.memo(Pagination, areEqual);
