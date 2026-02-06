package com.finfinal.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(
		properties = {
				"spring.main.lazy-initialization=true",
				"spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration"
		}
)
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}
}