import pytest
import asyncio
from src.bruteforce import PasswordCracker, BruteforceResult

@pytest.fixture
def cracker():
    return PasswordCracker()

@pytest.mark.asyncio
async def test_crack_basic_functionality(cracker):
    result = await cracker.crack("https://example.com/login")
    assert isinstance(result, BruteforceResult)
    assert isinstance(result.success, bool)
    assert isinstance(result.attempts, int)
    assert isinstance(result.time_elapsed, float)
    assert isinstance(result.method_used, str)
    assert isinstance(result.detection_level, int)
    if result.success:
        assert isinstance(result.password, str)
    else:
        assert result.password is None

@pytest.mark.asyncio
async def test_stealth_mode(cracker):
    # Test without stealth mode
    normal_result = await cracker.crack("https://example.com/login", stealth_mode=False)
    
    # Test with stealth mode
    stealth_result = await cracker.crack("https://example.com/login", stealth_mode=True)
    
    # Stealth mode should have lower detection level
    assert stealth_result.detection_level < normal_result.detection_level
    
    # Stealth mode should make fewer attempts
    assert stealth_result.attempts < normal_result.attempts

@pytest.mark.asyncio
async def test_hints_usage(cracker):
    hints = ["year", "name", "special"]
    result = await cracker.crack("https://example.com/login", hints=hints)
    
    if result.success:
        password = result.password
        # Password should contain elements suggested by hints
        has_year = any(str(year) in password for year in range(1970, 2025))
        has_name = any(name in password.lower() for name in ["john", "alice", "bob", "admin"])
        has_special = any(char in password for char in "!@#$")
        
        assert has_year or has_name or has_special
        assert result.method_used == "smart"

@pytest.mark.asyncio
async def test_attempt_ranges(cracker):
    # Test without stealth mode
    normal_result = await cracker.crack("https://example.com/login", stealth_mode=False)
    assert 1000 <= normal_result.attempts <= 10000
    
    # Test with stealth mode
    stealth_result = await cracker.crack("https://example.com/login", stealth_mode=True)
    assert 100 <= stealth_result.attempts <= 1000

@pytest.mark.asyncio
async def test_detection_level_ranges(cracker):
    result = await cracker.crack("https://example.com/login")
    assert 0 <= result.detection_level <= 100
    
    # Test correlation between attempts and detection
    high_detection = 0
    low_detection = 100
    
    for _ in range(5):
        result = await cracker.crack("https://example.com/login")
        high_detection = max(high_detection, result.detection_level)
        low_detection = min(low_detection, result.detection_level)
    
    assert high_detection > low_detection

@pytest.mark.asyncio
async def test_multiple_concurrent_cracks(cracker):
    targets = [
        "https://example.com/login1",
        "https://example.com/login2",
        "https://example.com/login3"
    ]
    tasks = [cracker.crack(target) for target in targets]
    results = await asyncio.gather(*tasks)
    
    assert len(results) == len(targets)
    assert all(isinstance(result, BruteforceResult) for result in results)

@pytest.mark.asyncio
async def test_invalid_target(cracker):
    with pytest.raises(ValueError):
        await cracker.crack("")
    
    with pytest.raises(ValueError):
        await cracker.crack("not_a_url")

@pytest.mark.asyncio
async def test_password_generation(cracker):
    # Test password generation with different hint combinations
    hint_sets = [
        ["year"],
        ["name"],
        ["special"],
        ["year", "name"],
        ["name", "special"],
        ["year", "name", "special"]
    ]
    
    for hints in hint_sets:
        result = await cracker.crack("https://example.com/login", hints=hints)
        if result.success:
            assert result.password is not None
            password = result.password
            
            if "year" in hints:
                assert any(str(year) in password for year in range(1970, 2025))
            if "name" in hints:
                assert any(name in password.lower() for name in ["john", "alice", "bob", "admin"])
            if "special" in hints:
                assert any(char in password for char in "!@#$")

@pytest.mark.asyncio
async def test_time_elapsed(cracker):
    result = await cracker.crack("https://example.com/login")
    assert 0.5 <= result.time_elapsed <= 10.0  # Reasonable time range 