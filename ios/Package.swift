// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "FlowIOS",
    platforms: [
        .iOS(.v16),
        .macOS(.v13)
    ],
    products: [
        .library(
            name: "FlowIOS",
            targets: ["FlowIOS"]
        ),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "FlowIOS",
            path: "Flow"
        ),
        .testTarget(
            name: "FlowIOSTests",
            dependencies: ["FlowIOS"],
            path: "Tests"
        )
    ]
)
