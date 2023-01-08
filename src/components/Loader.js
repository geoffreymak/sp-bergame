import React, { memo } from 'react';
import styled from 'styled-components';
// import { BoxLoading, TransverseLoading, BlockLoading } from 'react-loadingg';

export default memo(styled(({ className }) => (
  <div className={className}>
    <span className="loader__ball loader__ball--1" />
    <span className="loader__ball loader__ball--2" />
    <span className="loader__ball loader__ball--3" />
    {/* <BoxLoading /> */}
  </div>
))`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background: #300311;
  span.loader__ball {
    display: inline-block;
    margin: auto 0.25rem;
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
    background: #e91e63;
    &.loader__ball--1,
    &.loader__ball--2,
    &.loader__ball--3 {
      animation: bulging 2s infinite ease-in-out;
    }
    &.loader__ball--1 {
      animation-delay: -0.4s;
    }
    &.loader__ball--2 {
      animation-delay: -0.2s;
    }
    @keyframes bulging {
      0%,
      80%,
      100% {
        transform: scale(0);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }
  }
`);
