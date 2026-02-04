package com.finfinal.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class finfinal {

	public static void main(String[] args) {
		SpringApplication.run(finfinal.class, args);

        System.out.println("hiii i am working");
	}

}
