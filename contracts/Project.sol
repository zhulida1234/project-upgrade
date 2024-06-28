// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Project {

    address public creator;
    string public description;
    uint256 public goalAmount;
    uint256 public deadline;
    uint256 public currentAmount;
    enum ProjectState { Ongoing, Successful, Failed }
    ProjectState public state;

    struct Donation {
        address donor;
        uint256 amount; 
    }

    Donation[] public donations;
    /**捐赠事件*/
    event DonationReceived(address indexed donor, uint256 amount);
    /**项目状态变化事件*/
    event ProjectStateChanged(ProjectState newState);
    /**资金提取事件*/
    event FundsWithdrawn(address indexed creator, uint256 amount);
    /**资金撤回事件*/
    event FundsRefunded(address indexed donor, uint256 amount);

    modifier onlyAfterDeadline {
        require(block.timestamp < deadline, "Invalid Time");
        _;
    }

    modifier onlyCreator {
        require(msg.sender == creator,"only Creator");
        _;
    }

    function initialize(address _creator, string memory _description, uint256 _goalAmount, uint256 _duration) public{
        creator = _creator;
        description = _description;
        goalAmount = _goalAmount;
        deadline = block.timestamp + _duration;
        state = ProjectState.Ongoing;
    }

    function donate() external payable{
        require(state == ProjectState.Ongoing,"Invalid state");

        currentAmount += msg.value;
        donations.push(Donation({donor:msg.sender,amount:msg.value}));
        emit DonationReceived(msg.sender, msg.value);
    }

    function withdrawFunds() external onlyCreator onlyAfterDeadline{
        require(state == ProjectState.Failed,"Invalid state");

        payable(creator).transfer(currentAmount); 
        emit FundsWithdrawn(creator,currentAmount);
    }

    function refund() external onlyAfterDeadline {
        require(state == ProjectState.Failed,"Invalid state");

        for(uint i=0;i<donations.length;++i){
            Donation storage donation = donations[i];
            payable(donation.donor).transfer(donation.amount);
            emit FundsRefunded(donation.donor, donation.amount);
        }
    }

    function updateProjectState() external onlyAfterDeadline {
        require(state == ProjectState.Ongoing,"Invalid state");

        if(currentAmount < goalAmount ){
            state = ProjectState.Failed;
        }else{
            state = ProjectState.Successful;
        }
        emit ProjectStateChanged(state);
    }

}