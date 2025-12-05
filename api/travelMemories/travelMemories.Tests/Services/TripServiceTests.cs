using FluentAssertions;
using Moq;
using TravelMemories.Core.DTOs.Trip;
using TravelMemories.Core.Interfaces.Repositories;
using TravelMemories.Core.Models;
using TravelMemories.Service.Services;
using Xunit;

namespace TravelMemories.Tests.Services
{
    public class TripServiceTests
    {
        private readonly Mock<ITripRepository> _tripRepositoryMock;
        private readonly TripService _tripService;

        public TripServiceTests()
        {
            _tripRepositoryMock = new Mock<ITripRepository>();
            _tripService = new TripService(_tripRepositoryMock.Object);
        }

        [Fact]
        public async Task CreateTripAsync_ShouldCreateTrip_WhenValidRequest()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var tripRequest = new TripRequest
            {
                Name = "Test Trip",
                Description = "Test Description",
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddDays(7),
                LocationName = "Test Location",
                Latitude = (decimal?)40.7128,
                Longitude = (decimal?)-74.0060
            };

            Trip? savedTrip = null;
            _tripRepositoryMock
                .Setup(r => r.AddAsync(It.IsAny<Trip>()))
                .Callback<Trip>(t => savedTrip = t)
                .Returns(Task.CompletedTask);

            _tripRepositoryMock
                .Setup(r => r.SaveChangesAsync())
                .ReturnsAsync(true);

            // Act
            var result = await _tripService.CreateTripAsync(userId, tripRequest);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be(tripRequest.Name);
            result.Description.Should().Be(tripRequest.Description);
            result.UserId.Should().Be(userId);
            result.ShareId.Should().NotBeEmpty();
            
            _tripRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Trip>()), Times.Once);
            _tripRepositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateTripAsync_ShouldThrowException_WhenTripNotFound()
        {
            // Arrange
            var tripId = Guid.NewGuid();
            var userId = Guid.NewGuid();
            var tripRequest = new TripRequest
            {
                Name = "Updated Trip"
            };

            _tripRepositoryMock
                .Setup(r => r.GetByIdAsync(tripId))
                .ReturnsAsync((Trip?)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(
                () => _tripService.UpdateTripAsync(tripId, userId, tripRequest));
        }

        [Fact]
        public async Task UpdateTripAsync_ShouldThrowException_WhenUserNotAuthorized()
        {
            // Arrange
            var tripId = Guid.NewGuid();
            var ownerId = Guid.NewGuid();
            var unauthorizedUserId = Guid.NewGuid();
            var tripRequest = new TripRequest { Name = "Updated Trip" };

            var existingTrip = new Trip
            {
                Id = tripId,
                UserId = ownerId,
                Name = "Original Trip"
            };

            _tripRepositoryMock
                .Setup(r => r.GetByIdAsync(tripId))
                .ReturnsAsync(existingTrip);

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(
                () => _tripService.UpdateTripAsync(tripId, unauthorizedUserId, tripRequest));
        }
    }
}

