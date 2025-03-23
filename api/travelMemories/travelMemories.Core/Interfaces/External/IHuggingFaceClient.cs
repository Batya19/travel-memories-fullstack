using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TravelMemories.Core.Interfaces.External
{
    public interface IHuggingFaceClient
    {
        Task<byte[]> GenerateImageAsync(string prompt, string? style = null, string size = "512x512");
    }
}