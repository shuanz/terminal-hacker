import pytest
import asyncio
from src.network_scanner import NetworkScanner, ScanResult

@pytest.fixture
def scanner():
    return NetworkScanner()

@pytest.mark.asyncio
async def test_scan_basic_functionality(scanner):
    result = await scanner.scan("192.168.1.1")
    assert isinstance(result, ScanResult)
    assert isinstance(result.open_ports, list)
    assert isinstance(result.os_info, str)
    assert isinstance(result.vulnerabilities, list)
    assert isinstance(result.services, dict)
    assert isinstance(result.detection_level, int)
    assert isinstance(result.scan_time, float)

@pytest.mark.asyncio
async def test_stealth_mode(scanner):
    # Test without stealth mode
    normal_result = await scanner.scan("192.168.1.1", stealth_mode=False)
    
    # Test with stealth mode
    stealth_result = await scanner.scan("192.168.1.1", stealth_mode=True)
    
    # Stealth mode should have lower detection level
    assert stealth_result.detection_level < normal_result.detection_level

@pytest.mark.asyncio
async def test_scan_results_range(scanner):
    result = await scanner.scan("192.168.1.1")
    
    # Check open ports range
    assert len(result.open_ports) >= 3
    assert len(result.open_ports) <= 8
    assert all(isinstance(port, int) for port in result.open_ports)
    assert all(0 <= port <= 65535 for port in result.open_ports)
    
    # Check detection level range
    assert 0 <= result.detection_level <= 100
    
    # Check scan time range
    assert 0.5 <= result.scan_time <= 5.0

@pytest.mark.asyncio
async def test_os_info_format(scanner):
    result = await scanner.scan("192.168.1.1")
    assert result.os_info in [
        "Linux 5.15.0-generic",
        "Windows Server 2019",
        "FreeBSD 13.0-RELEASE",
        "Ubuntu 22.04 LTS",
        "CentOS 8.5",
    ]

@pytest.mark.asyncio
async def test_vulnerabilities_format(scanner):
    result = await scanner.scan("192.168.1.1")
    
    for vuln in result.vulnerabilities:
        assert "name" in vuln
        assert "severity" in vuln
        assert "description" in vuln
        assert vuln["severity"] in ["Low", "Medium", "High", "Critical"]

@pytest.mark.asyncio
async def test_services_format(scanner):
    result = await scanner.scan("192.168.1.1")
    
    for port, service in result.services.items():
        assert isinstance(port, int)
        assert isinstance(service, str)
        assert 0 <= port <= 65535

@pytest.mark.asyncio
async def test_multiple_concurrent_scans(scanner):
    targets = ["192.168.1.1", "192.168.1.2", "192.168.1.3"]
    tasks = [scanner.scan(target) for target in targets]
    results = await asyncio.gather(*tasks)
    
    assert len(results) == len(targets)
    assert all(isinstance(result, ScanResult) for result in results)

@pytest.mark.asyncio
async def test_invalid_target(scanner):
    with pytest.raises(ValueError):
        await scanner.scan("")
    
    with pytest.raises(ValueError):
        await scanner.scan("invalid_ip")

@pytest.mark.asyncio
async def test_detection_level_calculation(scanner):
    # Test with different combinations of open ports and vulnerabilities
    results = []
    for _ in range(5):
        result = await scanner.scan("192.168.1.1")
        results.append(result)
    
    # Detection level should correlate with number of open ports and vulnerabilities
    for i in range(len(results) - 1):
        current = results[i]
        next_result = results[i + 1]
        
        if len(current.open_ports) > len(next_result.open_ports) and \
           len(current.vulnerabilities) > len(next_result.vulnerabilities):
            assert current.detection_level > next_result.detection_level 