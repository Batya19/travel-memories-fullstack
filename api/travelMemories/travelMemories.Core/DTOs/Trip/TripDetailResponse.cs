using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TravelMemories.Core.DTOs.Image;

namespace TravelMemories.Core.DTOs.Trip
{
    public class TripDetailResponse : TripResponse
    {
        public IEnumerable<ImageResponse> Images { get; set; }
    }
}
