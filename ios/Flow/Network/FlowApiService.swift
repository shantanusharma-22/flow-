import Foundation

public class FlowApiService {
    public static let shared = FlowApiService()
    
    // Default endpoint points to production Vercel deployment with local fallback
    public var baseUrl = "https://bitchord-replica.vercel.app/api"
    
    private init() {}
    
    public struct ExploreResponse: Codable {
        public let trendingTracks: [Track]
    }
    
    public struct SearchResponse: Codable {
        public let results: SearchResults
    }

    public struct SearchResults: Codable {
        public let songs: [Track]
    }
    
    public func fetchExploreFeed() async throws -> [Track] {
        guard let url = URL(string: "\(baseUrl)/explore") else { return [] }
        let (data, _) = try await URLSession.shared.data(from: url)
        let response = try JSONDecoder().decode(ExploreResponse.self, data: data)
        return response.trendingTracks
    }
    
    public func searchTracks(query: String) async throws -> [Track] {
        guard let encoded = query.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "\(baseUrl)/search?q=\(encoded)&category=songs") else { return [] }
        let (data, _) = try await URLSession.shared.data(from: url)
        let response = try JSONDecoder().decode(SearchResponse.self, data: data)
        return response.results.songs
    }
}
