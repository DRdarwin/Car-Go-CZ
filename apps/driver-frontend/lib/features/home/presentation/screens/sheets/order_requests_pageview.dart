import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:driver_flutter/config/locator/locator.dart';
import 'package:driver_flutter/core/entities/order_request.dart';
import 'package:driver_flutter/features/home/presentation/components/order_request_item.dart';

import '../../blocs/home.dart';

class OrderRequestsPageView extends StatelessWidget {
  final List<OrderRequestEntity> requests;

  const OrderRequestsPageView({
    super.key,
    required this.requests,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 16),
        child: SizedBox(
          height: 420,
          child: CarouselSlider.builder(
            options: CarouselOptions(
              height: 420,
              viewportFraction: 0.9,
              onPageChanged: (index, reason) {
                locator<HomeBloc>().add(
                  HomeEvent.onOrderRequestPageChanged(
                    request: requests[index],
                  ),
                );
              },
            ),
            itemCount: requests.length,
            itemBuilder: (context, index, realIndex) => Padding(
              padding: const EdgeInsets.symmetric(horizontal: 6),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OrderRequestItem(request: requests[index]),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
