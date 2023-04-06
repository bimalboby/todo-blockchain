// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract TaskContract {
  event AddTask(address recipient,uint taskId);
  event DeleteTask(uint taskId, bool isDeleted);

  struct Task{
    uint id;
    string taskText;
    bool isDeleted;

  }

}
