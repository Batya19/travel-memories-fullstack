using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace travelMemories.Core.Interfaces.External
{
   public interface IHuggingFaceClient
    {
        Task<string> GenerateImageAsync(string prompt, string style, string size);
    }
}
