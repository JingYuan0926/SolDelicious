// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserPreferencesAndReviews {
    // Mapping from user address to preferences string
    mapping(address => string) public userPreferences;

    // Struct to store review details
    struct Review {
        uint8 rating;
        string comment;
        uint8 confidenceScore;
    }

    // Mapping from user address to their review
    mapping(address => Review) public userReviews;

    // Event to emit when preferences are updated
    event PreferencesUpdated(address indexed user, string preferences);

    // Event to emit when a review is submitted
    event ReviewSubmitted(address indexed user, uint8 rating, string comment, uint8 confidenceScore);

    // Function to set or update user preferences
    function setUserPreferences(string memory _preferences) public {
        userPreferences[msg.sender] = _preferences;
        emit PreferencesUpdated(msg.sender, _preferences);
    }

    // Function to get user preferences
    function getUserPreferences(address _user) public view returns (string memory) {
        return userPreferences[_user];
    }

    // Function to check if a user has set preferences
    function hasPreferences(address _user) public view returns (bool) {
        return bytes(userPreferences[_user]).length > 0;
    }

    // Function to submit a review
    function submitReview(uint8 _rating, string memory _comment, uint8 _confidenceScore) public {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        require(_confidenceScore >= 0 && _confidenceScore <= 100, "Confidence score must be between 0 and 100");
        
        userReviews[msg.sender] = Review(_rating, _comment, _confidenceScore);
        emit ReviewSubmitted(msg.sender, _rating, _comment, _confidenceScore);
    }

    // Function to get a user's review
    function getUserReview(address _user) public view returns (uint8, string memory, uint8) {
        Review memory review = userReviews[_user];
        return (review.rating, review.comment, review.confidenceScore);
    }

    // Function to check if a user has submitted a review
    function hasReview(address _user) public view returns (bool) {
        return userReviews[_user].rating != 0;
    }
}